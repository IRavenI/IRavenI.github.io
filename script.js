let message = document.querySelector('.email-subscribe');
let form = document.querySelector('.subscription');
let email = document.querySelector('.email-subscribe');
form.onsubmit = function(evt) {
  message.textContent = 'Адрес добавлен в базу данных. Теперь Вы подписчик блога!'
};
