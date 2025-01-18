
const setCopyrightYearFooter = () =>
{
    footerElement = document.querySelector('.footer-copyright');
    thisYear = new Date().getFullYear();
    footerElement.innerText = `@ Gabriel Rowan ${thisYear}`;

}

setCopyrightYearFooter()
