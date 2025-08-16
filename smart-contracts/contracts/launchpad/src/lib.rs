#![cfg_attr(not(feature = "std"), no_std, no_main)]

//! # Launchpad Lunes - Upgradeable Smart Contracts System

// --- Module Declarations ---
// Módulos principais funcionais
pub mod complete_launchpad;
pub mod launchpool_system;
pub mod raffle_system;

// Módulos de exemplo e demonstração (simplificado)
pub mod phases_demo;

// --- System-wide Constants ---
pub const MAX_STRING_LENGTH: u32 = 1000;

// --- Utility Functions ---
pub mod utils {
    // ... (manteremos as funções utilitárias se forem necessárias)
}

// --- Prelude ---
pub mod prelude {
    // ... (será preenchido com os tipos e constantes relevantes)
}
