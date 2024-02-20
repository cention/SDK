export const env = {
    URL: 'https://cloud-qa.cention.com',
  };
export const socketenv = {
    URL: 'wss://cloud-qa.cention.com',
  };
  export const getCustomSdk = async (workSpace, widgetId) => {
    
    try {
      const response = await fetch(`${env.URL}/s/${workSpace}/cention/chat/chatWidgetConfig?a=${widgetId}`, {
        method: 'GET',
        headers: {
          
        },
      });
      // console.log('here try and see                     ', response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const jsonData = await response.json();
      // console.log({jsonData})
      return jsonData; 
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; 
    }
  };
  