const formatDate = (dateString) => {
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};
const formatShortDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

export { formatDate, formatShortDate };
