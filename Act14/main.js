const { createApp, ref } = Vue;

createApp({
    setup() {
        const email = ref('');
        const password = ref('');
        const emailError = ref(false);
        const emailError2 = ref(false);
        const nameError = ref(false);
        const nicknameError = ref(false);
        const passwordError = ref(false);
        const passwordError2 = ref(false);
        const userEditName = ref('');
        const userEditEmail = ref('');
        const userEditNickname = ref('');
        let newUserName = ref('');
        let newUserEmail = ref('');
        let newUserNickname = ref('');
        let newUserPassword = ref('');
        let newUserPasswordConfirm = ref('');
        let userEditID = ref('');
        let sessionStarted = ref(false);
        let users = ref([]);

        //Acceder a los usuarios
        const onSubmit = () => {
            fetch("http://localhost:8000/users.json", )
            .then(res=>res.json())
            .then((response) => {
                let found = false;
                response.forEach((e) => {
                    if ((email.value.toLowerCase() === e.email.toLowerCase()) && (password.value === e.password)) {
                        found = true;
                        users.value = response;
                    }
                });
                if (!found) {
                    Swal.fire({
                    icon: 'error',
                    title: 'Sesion no iniciada',
                    text: 'Email o contrasena incorrecta.',
                    confirmButtonText: 'Aceptar'
                })
                }
                sessionStarted.value = found;
            })
            .catch(e => console.log(e));
        };

        //Guardar usuario
        const saveNewUser = () => {
            let userFind = false;
            emailError.value = false;
            emailError2.value = false;
            nameError.value = false;
            passwordError.value = false;

            users.value.forEach((u) => {
                if (u.email.toLowerCase() === newUserEmail.value.toLowerCase()) {
                    userFind = true;
                }
            });

            nameError.value = (!validateName(newUserName.value));
            emailError.value = (!validateEmail(newUserEmail.value));
            nicknameError.value = (newUserNickname.value === '');
            passwordError.value = (newUserPasswordConfirm.value !== newUserPassword.value);
            passwordError2.value = (newUserPasswordConfirm.value === '');
            emailError2.value = userFind;
            
            if (!userFind && !passwordError.value && !emailError.value && !nameError.value && !passwordError2.value && !nicknameError.value) { //Guardar

                const newUser = {
                    user_id: users.value.length + 1,
                    name: newUserName.value,
                    email: newUserEmail.value,
                    nickname: newUserNickname.value,
                    password: newUserPassword.value
                }

                users.value.push(newUser);

                Swal.fire({
                    icon: 'success',
                    title: 'Agregado',
                    text: 'Usuario agregado con exito.',
                    confirmButtonText: 'Aceptar'
                });

                closeModal('#newUsers');
                reset();
            }
        };

        const closeModal = (modal) => {
            const myModal = bootstrap.Modal.getOrCreateInstance(modal)
            myModal.hide();
        };

        const openModal = (modal) => {
            const myModal = bootstrap.Modal.getOrCreateInstance(modal)
            myModal.show();
        };

        //Editar
        const selectUser = (userId) => {
            openModal('#editUsers')
            userEditName.value = users.value[userId - 1].name;
            userEditEmail.value = users.value[userId - 1].email;
            userEditNickname.value = users.value[userId - 1].nickname;
            userEditID.value = userId;
        }

        const saveEditUser = () => {
            users.value[userEditID.value - 1].name = userEditName.value;
            users.value[userEditID.value - 1].email = userEditEmail.value;
            users.value[userEditID.value - 1].nickname = userEditNickname.value;
            closeModal('#editUsers');
            reset();
        }

        const reset = () => {
            // Reiniciar los campos
            newUserName.value = '';
            newUserEmail.value = '';
            newUserNickname.value = '';
            newUserPassword.value = '';
            newUserPasswordConfirm.value = '';
            emailError.value = false;
            emailError2.value = false;
            nameError.value = false;
            passwordError.value = false;
            nicknameError.value = false;
            passwordError2.value = false;
            userEditName.value = '';
            userEditEmail.value = '';
            userEditNickname.value = '';
            userEditID.value = '';
        }

        //Validar Correo
        const validateEmail = (email) => {
            // Expresión regular para validar el correo
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        };

        //Validar nombre
        const validateName = (name) => {
            // Expresión regular para validar el correo
            const re = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s']+$/;
            return re.test(String(name).toLowerCase());
        };

        return {
            email,
            password,
            sessionStarted,
            users,
            newUserName,
            newUserEmail,
            newUserNickname,
            newUserPassword,
            newUserPasswordConfirm,
            emailError,
            emailError2,
            nameError,
            nicknameError,
            passwordError,
            passwordError2,
            userEditName,
            userEditEmail,
            userEditNickname,
            userEditID,
            reset,
            saveNewUser,
            onSubmit,
            openModal,
            selectUser,
            saveEditUser
        };
    }
}).mount('#app');

