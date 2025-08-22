/**
 * Componente de Demonstração dos Design Tokens
 * Mostra como usar o sistema de design tokens da plataforma Launchpad
 */

import React from "react";
import {
  tokens,
  colors,
  typography,
  spacingTokens,
  shadows,
  borders,
} from "../../tokens";

export interface DesignTokensDemoProps {
  className?: string;
}

export const DesignTokensDemo: React.FC<DesignTokensDemoProps> = ({
  className = "",
}) => {
  return (
    <div className={`p-8 space-y-8 ${className}`}>
      {/* Título */}
      <div>
        <h1
          className="text-grafite-50 mb-2"
          style={{
            ...tokens.getTextStyle("h1"),
            color: colors.neutral.text.primary,
          }}
        >
          Design Tokens Demo
        </h1>
        <p
          className="text-grafite-300"
          style={{
            ...tokens.getTextStyle("body"),
            color: colors.neutral.text.secondary,
          }}
        >
          Demonstração do sistema de design tokens da Launchpad
        </p>
      </div>

      {/* Seção de Cores */}
      <section>
        <h2 className="text-grafite-100 mb-4" style={tokens.getTextStyle("h3")}>
          Paleta de Cores
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Cores da Marca */}
          <div>
            <h3 className="text-grafite-200 text-sm font-medium mb-2">
              Grafite
            </h3>
            <div className="space-y-2">
              {Object.entries(colors.grafite).map(([shade, color]) => (
                <div key={shade} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border border-grafite-600"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-grafite-300">{shade}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-grafite-200 text-sm font-medium mb-2">Roxo</h3>
            <div className="space-y-2">
              {Object.entries(colors.roxo).map(([shade, color]) => (
                <div key={shade} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border border-grafite-600"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-grafite-300">{shade}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-grafite-200 text-sm font-medium mb-2">Verde</h3>
            <div className="space-y-2">
              {Object.entries(colors.verde).map(([shade, color]) => (
                <div key={shade} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border border-grafite-600"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-grafite-300">{shade}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-grafite-200 text-sm font-medium mb-2">
              Laranja
            </h3>
            <div className="space-y-2">
              {Object.entries(colors.laranja).map(([shade, color]) => (
                <div key={shade} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border border-grafite-600"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-grafite-300">{shade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Tipografia */}
      <section>
        <h2 className="text-grafite-100 mb-4" style={tokens.getTextStyle("h3")}>
          Tipografia
        </h2>

        <div className="space-y-4">
          {Object.entries(typography.textStyles).map(([styleName, style]) => (
            <div key={styleName} className="flex items-center gap-4">
              <div className="w-20 text-xs text-grafite-400">{styleName}</div>
              <div className="text-grafite-100" style={style}>
                The quick brown fox jumps over the lazy dog
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Espaçamentos */}
      <section>
        <h2 className="text-grafite-100 mb-4" style={tokens.getTextStyle("h3")}>
          Espaçamentos
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(spacingTokens.component.padding).map(
            ([size, value]) => (
              <div key={size} className="text-center">
                <div className="text-xs text-grafite-400 mb-2">
                  {size} - {value}
                </div>
                <div
                  className="bg-roxo-500 mx-auto"
                  style={{
                    width: "60px",
                    height: "40px",
                    padding: value,
                  }}
                >
                  <div className="bg-grafite-700 w-full h-full rounded-sm" />
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Seção de Sombras */}
      <section>
        <h2 className="text-grafite-100 mb-4" style={tokens.getTextStyle("h3")}>
          Sombras
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(shadows.dark).map(([size, shadow]) => (
            <div key={size} className="text-center">
              <div className="text-xs text-grafite-400 mb-2">{size}</div>
              <div
                className="bg-grafite-800 w-20 h-20 mx-auto rounded-lg"
                style={{ boxShadow: shadow }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Bordas */}
      <section>
        <h2 className="text-grafite-100 mb-4" style={tokens.getTextStyle("h3")}>
          Raios de Borda
        </h2>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {Object.entries(borders.radius).map(([size, radius]) => (
            <div key={size} className="text-center">
              <div className="text-xs text-grafite-400 mb-2">{size}</div>
              <div
                className="bg-roxo-500 w-16 h-16 mx-auto"
                style={{ borderRadius: radius }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Componentes com Tokens */}
      <section>
        <h2 className="text-grafite-100 mb-4" style={tokens.getTextStyle("h3")}>
          Componentes com Design Tokens
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card de exemplo */}
          <div
            className="bg-grafite-800 p-6"
            style={{
              borderRadius: tokens.getBorderRadius("xl"),
              boxShadow: tokens.getShadow("md", true),
              border: `1px solid ${colors.grafite[600]}`,
            }}
          >
            <h3
              className="text-grafite-100 mb-2"
              style={tokens.getTextStyle("h5")}
            >
              Card com Design Tokens
            </h3>
            <p className="text-grafite-300" style={tokens.getTextStyle("body")}>
              Este card utiliza os design tokens para espaçamento, cores,
              tipografia e sombras.
            </p>
          </div>

          {/* Botão de exemplo */}
          <div className="space-y-4">
            <button
              className="bg-roxo-500 hover:bg-roxo-600 text-white px-6 py-3 transition-colors"
              style={{
                borderRadius: tokens.getBorderRadius("lg"),
                ...tokens.getTextStyle("button"),
                boxShadow: tokens.getShadow("sm", true),
              }}
            >
              Botão Primário
            </button>

            <button
              className="bg-transparent border text-roxo-400 hover:bg-roxo-500 hover:text-white px-6 py-3 transition-colors"
              style={{
                borderRadius: tokens.getBorderRadius("lg"),
                borderColor: colors.roxo[500],
                ...tokens.getTextStyle("button"),
              }}
            >
              Botão Outline
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignTokensDemo;
