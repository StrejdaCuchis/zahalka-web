const JEDNOPISMENNE_SLOVO = /(?<![\p{L}\p{N}_])([ksvzouai])[ \t]+(?=\S)/giu;

/**
 * Sváže české jednopísmenné předložky a spojky s následujícím slovem.
 * Funkce pracuje jen s textem, nevkládá HTML a opakované volání je bezpečné.
 */
export function ceskaTypografie(text: string): string {
  return text.replace(
    JEDNOPISMENNE_SLOVO,
    (_shoda, slovo: string) => `${slovo}\u00a0`,
  );
}
