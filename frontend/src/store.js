function formatDateTo12Hours(dateString) {
    const date = new Date(dateString);
  
    // Extract hours, minutes, and seconds
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hour is 0, set it to 12
  
    // Format minutes and seconds to always show two digits
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  
    // Build formatted date string
    const formattedDate = `${date.toLocaleDateString()} ${hours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    
    return formattedDate;
  }


 

  const handlePrint = () => {
    window.print();
  };



  export {
    formatDateTo12Hours,
    handlePrint

  }