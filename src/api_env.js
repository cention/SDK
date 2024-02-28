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

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();
      return jsonData; 
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; 
    }
  };

export const getActiveAgents = async (workSpace, widgetId) =>{
  try {
    const response = await fetch(`${env.URL}/s/${workSpace}/socket/external.api/agentlist?areas=${widgetId}&who=active`, {
      method: 'GET',
      headers: {
        
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonData = await response.json();
    return jsonData; 
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; 
  }

}
export const postUploadAnswerAttachment = async( body, workSpace) => {
  try {
  const response = await fetch(
    `${env.URL}/s/${workSpace}/Cention/web/chat/client/uploadAttachment`,
    {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'multipart/form-data',
      },
      credentials: 'same-origin',
      body: body,
    },
  );
  const jsonData = await response.json();
  return jsonData; 
} catch (error) {
  console.error('Error fetching data:', error);
  throw error; 
}
};
