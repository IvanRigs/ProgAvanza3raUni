const { createApp, ref } = Vue;

createApp({
    setup() {
        const email = ref('');
        const registroExitoso = ref(false);
        const movies = ref([]);
        const movie = ref();
        const username = ref('');
        const password = ref('');
        const errorLogin = ref(false);
        const verInfo = ref(false);
        const requestToken = ref('');
        const sessionId = ref('');
        const range = ref('0');

        const apiKey = 'f8c72830b3e50f4fdd3857dea8cb5d97';

        fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                requestToken.value = data.request_token;
                console.log('Request Token:', requestToken);
            })
            .catch(error => console.error('Error obteniendo el request token:', error));


        const getMovies = () => {
            console.log('getMovies');
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOGM3MjgzMGIzZTUwZjRmZGQzODU3ZGVhOGNiNWQ5NyIsIm5iZiI6MTcyNzIyNjUwOS45NjU1OTEsInN1YiI6IjY2ZjBiODRmMDIyMDhjNjdjODhjZmMzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.P8jdnLk2KpWpELcLJ_BDTAdx1DVAEUi8ynbrXQDv_xA");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch("https://api.themoviedb.org/3/discover/movie", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    movies.value = result.results;
                    console.log(movies.value);
                })
                .catch((error) => console.error(error));
        }

        getMovies();

        const getMovieId = (movieId) => {
            const apiKey = 'f8c72830b3e50f4fdd3857dea8cb5d97';

            fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    movie.value = data;
                    console.log(movie.value)
                    verInfo.value = true;
                })
                .catch(error => console.error('Error fetching movie details:', error));

        }

        const addRate = (movieIdP, rate) => {
            rate = (rate === '0') ? '0.5' : rate;
            if (!localStorage.getItem('sessionId')) {
                alert("Debes iniciar sesión para calificar una película.");
                return;
            }

            fetch(`https://api.themoviedb.org/3/movie/${movieIdP}/rating?api_key=${apiKey}&session_id=${localStorage.getItem('sessionId')}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ value: rate })
            })
                .then(response => response.json())
                .then(data => {
                    alert('Rate enviada con éxito');
                })
                .catch(error => console.error('Error al enviar la calificación:', error));
        };

        const deleteRate = (movieId) => {
            const apiKey = 'f8c72830b3e50f4fdd3857dea8cb5d97';

            if (!sessionId) {
                alert("Debes iniciar sesión para eliminar la calificación de una película.");
                return;
            }

            fetch(`https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${apiKey}&session_id=${localStorage.getItem('sessionId')}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar la calificación');
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Rate eliminada con éxito');
                })
                .catch(error => console.error('Error:', error));
        };

        const postLogin = () => {
            fetch('https://api.themoviedb.org/3/authentication/token/validate_with_login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOGM3MjgzMGIzZTUwZjRmZGQzODU3ZGVhOGNiNWQ5NyIsIm5iZiI6MTcyNzIyNjUwOS45NjU1OTEsInN1YiI6IjY2ZjBiODRmMDIyMDhjNjdjODhjZmMzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.P8jdnLk2KpWpELcLJ_BDTAdx1DVAEUi8ynbrXQDv_xA'
                },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                    request_token: requestToken.value
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Login exitoso, token validado:', requestToken.value);

                        fetch(`https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                request_token: requestToken.value
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    sessionId.value = data.session_id;
                                    localStorage.setItem('sessionId', sessionId.value);
                                    console.log('Session creada:', sessionId.value);
                                    location.href = "/movies.html";
                                } else {
                                    console.error('Error al crear la sesión:', data);
                                }
                            })
                            .catch(error => console.error('Error al crear la sesión:', error));
                    } else {
                        errorLogin.value = true;
                        console.error('Error de login:', data.status_message);
                    }
                })
                .catch(error => console.error('Error al validar el request token:', error));
        };




        const registrarse = () => {
            registroExitoso.value = true;
        }

        return {
            email,
            registroExitoso,
            movies,
            username,
            password,
            errorLogin,
            movie,
            verInfo,
            range,
            registrarse,
            postLogin,
            getMovies,
            getMovieId,
            addRate,
            deleteRate
        };
    }
}).mount('#app');

