// Tiny id generator for the in-memory note store.
let counter = 0;

export function nextId(): number {
  return ++counter;
}

export function resetIds(): void {
  counter = 0;
}
