export const formatTimeDifference = (createdAt: string | number | Date) => {
    const currentTime = new Date();
    const createdTime = new Date(createdAt);

    const currentTimeTimestamp = currentTime.getTime();
    const createdTimeTimestamp = createdTime.getTime();

    const timeDifference = currentTimeTimestamp - createdTimeTimestamp
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const weeksDifference = Math.floor(daysDifference / 7);
    const yearsDifference = Math.floor(daysDifference / 365);
  
    if (secondsDifference < 60) {
      return `${secondsDifference} seconds ago`;
    } else if (minutesDifference < 60) {
      return `${minutesDifference} ${minutesDifference === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hoursDifference < 24) {
      return `${hoursDifference} ${hoursDifference === 1 ? 'hour' : 'hours'} ago`;
    } else if (daysDifference < 7) {
      return `${daysDifference} ${daysDifference === 1 ? 'day' : 'days'} ago`;
    } else if (weeksDifference < 52) {
      return `${weeksDifference} ${weeksDifference === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return `${yearsDifference} ${yearsDifference === 1 ? 'year' : 'years'} ago`;
    }
  };