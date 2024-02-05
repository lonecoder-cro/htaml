(function () {

    window.addEventListener('load', () => {

        const sendEmail = (serviceID, templateID, publicKey) => {
            emailjs.init(publicKey)

            const name = document.querySelector('form input[name="name"]').value
            const email = document.querySelector('form input[name="email"]').value
            const message = document.querySelector('form textarea[name="message"]').value
            const blip = document.querySelector('form p')
            const template = { from_name: name, to_name: 'LoneCoder.cro', from_email: email, message: message }

            emailjs.send(serviceID, templateID, template, publicKey).then((response) => {
                blip.style = 'visibility: visible;color:white;'
                setTimeout(() => {
                    blip.style = 'visibility: hidden'
                }, 3500)
            }, function (error) {
                blip.innerText = error.text
                blip.style = 'visibility: visible;color:red;'
            })
        }

        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('observer-show')
                } else {
                    entry.target.classList.remove('observer-hide')
                }
            })
        }, {})

        document.querySelectorAll('.observer').forEach((e) =>      observer.observe(e) )

        //on form submit
        document.querySelector('form').onsubmit = (e) => {
            e.preventDefault()

            const serviceID = 'lonecoder.cro'
            const templateID = 'template_sg1r95t'
            const publicKey = 'TGv8rzE3oPPbv8wlP'
            sendEmail(serviceID, templateID, publicKey)

        }

    })
})()
