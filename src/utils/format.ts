export const formatPrix = (prix: number, transaction: string) => {
  if (transaction === 'location') {
    return `${prix.toLocaleString('fr-FR')} FCFA/mois`;
  }
  if (prix >= 1000000000) {
    return `${(prix / 1000000000).toFixed(1)} Mds FCFA`;
  }
  return `${(prix / 1000000).toFixed(0)} M FCFA`;
};
