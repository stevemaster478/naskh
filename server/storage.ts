// Storage per l'applicazione Naskh
// Non serve persistenza dati utente per questa applicazione stateless

export interface IStorage {
  // Placeholder per future necessità di storage
}

export class MemStorage implements IStorage {
  constructor() {
    // Nessun dato da mantenere in memoria
  }
}

export const storage = new MemStorage();
