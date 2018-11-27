const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const arrayUnique = function(array) {
  let arr = Array.from(new Set(array));
  console.log(arr);
  return arr;
}

const arrayColumn = function(array, column) {
  let arr = [];
  arr.push(array.column);
  return arr;
}

module.exports = {
  formatTime: formatTime,
  arrayUnique: arrayUnique
}