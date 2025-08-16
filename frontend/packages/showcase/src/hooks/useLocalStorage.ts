import { useState, useEffect } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Pega do localStorage
      const item = window.localStorage.getItem(key)
      // Analisa JSON armazenado ou se nenhum retorna initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Se erro também retorna initialValue
      console.log(error)
      return initialValue
    }
  })

  // Retorna versão 'wrapped' da função useState que persiste o novo valor no localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite que o valor seja uma função para que tenhamos a mesma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Salva no estado
      setStoredValue(valueToStore)
      // Salva no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // Um erro mais avançado pode implementar relato de erros
      console.log(error)
    }
  }

  return [storedValue, setValue] as const
}

export default useLocalStorage
