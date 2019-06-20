export const today = new Date();
export const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
export const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
export const curDateTime = date + ' ' + time;