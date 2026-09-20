const ntfyUrl = (config) => `https://${config.domain || 'ntfy.sh'}/${config.topic}`

export const notify = async (file, filename, message, config) => {
  try {
    await fetch(ntfyUrl(config), {
      method: 'PUT',
      headers: {
        'Title': 'Paris Tennis',
        'Message': message,
        'Icon': 'https://em-content.zobj.net/source/apple/419/tennis_1f3be.png',
        'Filename': filename,
        'Tags': 'calendar',
      },
      body: file
    })
    console.log('Notification sent via ntfy')
  } catch (err) {
    console.log('Error while sending notification using ntfy:', err)
  }
}

/** Text-only alert (e.g. late CI start). */
export const notifyText = async (message, config, { title = 'Paris Tennis', tags = 'warning' } = {}) => {
  try {
    await fetch(ntfyUrl(config), {
      method: 'POST',
      headers: {
        'Title': title,
        'Tags': tags,
        'Priority': 'high',
      },
      body: message
    })
    console.log('Text notification sent via ntfy')
  } catch (err) {
    console.log('Error while sending text notification using ntfy:', err)
  }
}
