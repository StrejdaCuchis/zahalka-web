const JEDNOPISMENNE_SLOVO = /(^|[\s(\[{„“"'])([ksvzouai])[ \t]+(?=\S)/giu;

/**
 * Sváže české jednopísmenné předložky a spojky s následujícím slovem.
 * Funkce pracuje jen s textem, nevkládá HTML a opakované volání je bezpečné.
 */
export function ceskaTypografie(text: string): string {
  return text.replace(
    JEDNOPISMENNE_SLOVO,
    (_shoda, zacatek: string, slovo: string) => `${zacatek}${slovo}\u00a0`,
  );
}
