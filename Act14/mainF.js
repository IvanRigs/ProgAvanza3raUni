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
        const userEditEmail2 = ref('');
        const userEditNickname = ref('');
        let newUserName = ref('');
        let userName = ref('');
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

                let id = 0;
                users.value.forEach((u) => {
                    if (u.user_id > id){
                        id = u.user_id;
                    }
                });

                const newUser = {
                    user_id: (parseInt(id, 10) + 1),
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
            users.value.forEach((u, index) => {
                if (u.user_id === userId) {
                    userId = index;
                }
            });


            openModal('#editUsers')
            userEditName.value = users.value[userId].name;
            userName.value = userEditName.value;
            userEditEmail.value = users.value[userId].email;
            userEditEmail2.value = userEditEmail.value;
            userEditNickname.value = users.value[userId].nickname;
            userEditID = userId;
        }

        const saveEditUser = () => {
            let userFind = false;

            users.value.forEach((u) => {
                if ((u.email.toLowerCase() === userEditEmail.value.toLowerCase()) && (userEditEmail2.value !== userEditEmail.value)) {
                    userFind = true;
                }
            });

            nameError.value = (!validateName(userEditName.value));
            emailError.value = (!validateEmail(userEditEmail.value));
            emailError2.value = userFind;
            nicknameError.value = (userEditNickname.value === '');

            if (!nameError.value && !emailError.value && !nicknameError.value && !userFind) {
                users.value[userEditID].name = userEditName.value;
                users.value[userEditID].email = userEditEmail.value;
                users.value[userEditID].nickname = userEditNickname.value;
                closeModal('#editUsers');
                reset();
            }
        }

        // Borrar usuario
        const userDelete = () => {
            users.value.splice(userEditID, 1);
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
            userEditID.value = '';
            emailError.value = false;
            emailError2.value = false;
            nameError.value = false;
            passwordError.value = false;
            nicknameError.value = false;
            passwordError2.value = false;
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
            userName,
            reset,
            saveNewUser,
            onSubmit,
            openModal,
            selectUser,
            saveEditUser,
            userDelete
        };
    }
}).mount('#app');

