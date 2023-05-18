/** Verifies a chip exists after player lookup. */
export function verifyChip(chipText: string): void {
  it('should have valid chip', () => {
    // found bans
    cy.contains('mat-chip', chipText, { matchCase: false });
  });
}
