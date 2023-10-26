// PARTE 1
 
const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
 
const form = document.querySelector('.form');
const input = document.querySelector('.input__search_1');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
 
let searchPokemon = 1;
 
const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}
 
const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = 'Loading...';
    pokemonNumber.innerHTML = '';
    const data = await fetchPokemon(pokemon);
 
    if (data) {
      pokemonImage.style.display = 'block';
      pokemonName.innerHTML = data.name;
      pokemonNumber.innerHTML = data.id;
     
      if (data['sprites']['versions']['generation-v']['black-white']['animated']) {
        // Se a propriedade 'animated' existir, use-a
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
      } else if (data['sprites']['other']['official-artwork']['front_default']) {
        // Se 'animated' não existe, tente buscar a imagem em outra fonte
        pokemonImage.src = data['sprites']['other']['official-artwork']['front_default'];
      }
 
      input.value = '';
 
      searchPokemon = data.id;
    } else {
      pokemonImage.style.display = 'none';
      pokemonName.innerHTML = 'Not found :c';
      pokemonNumber.innerHTML = '';
    }
  }
 
form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});
buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});
buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  renderPokemon(searchPokemon);
});
renderPokemon(searchPokemon);
 
// PARTE 2
 
 
const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
const totalPokemon = 1208; // Total de Pokémon que você deseja recuperar
 
async function fetchAllPokemon() {
    const pokemonContainer = document.getElementById('pokemon-list');
    const searchInput = document.getElementById('pokemon-search'); // Referência ao input de pesquisa
 
    // Função para filtrar os Pokémon com base no nome
    function filterPokemon(pokemonName) {
        const allPokemonCards = pokemonContainer.querySelectorAll('.pokemon-card');
        allPokemonCards.forEach((pokemonCard) => {
            const name = pokemonCard.getAttribute('data-name');
            if (name.toLowerCase().includes(pokemonName.toLowerCase())) {
                pokemonCard.style.display = 'block';
            } else {
                pokemonCard.style.display = 'none';
            }
        });
    }
 
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        filterPokemon(searchTerm);
    });
 
    for (let i = 1; i <= totalPokemon; i++) {
        const pokemonUrl = `${apiUrl}${i}`;
        try {
            const response = await fetch(pokemonUrl);
            if (!response.ok) {
                throw new Error('Erro na requisição à API');
            }
            const pokemonData = await response.json();
            const pokemonCard = document.createElement('div');
            pokemonCard.classList.add('pokemon-card');
            pokemonCard.setAttribute('data-name', pokemonData.name); // Adiciona o nome como um atributo de dados
            pokemonCard.innerHTML = `
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <p>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</p>
            `;
            pokemonContainer.appendChild(pokemonCard);
        } catch (error) {
            console.error(`Erro ao recuperar dados do Pokémon ${i}`, error);
        }
    }
}
 
// Chame a função para buscar todos os 1208 Pokémon
fetchAllPokemon();
 
function createPokemonCard(pokemonData) {
    const pokemonContainer = document.getElementById('pokemon-list');
    const pokemonCard = document.createElement('button');
    pokemonCard.classList.add('pokemon-card');
   
    const types = pokemonData.types.map(type => type.type.name).join(', ');
    const abilities = pokemonData.abilities.map(ability => ability.ability.name).join(', ');
   
    pokemonCard.innerHTML = `
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
        <p>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</p>
        <p>ID: ${pokemonData.id}</p>
        <p>Altura: ${pokemonData.height} dm</p>
        <p>Peso: ${pokemonData.weight} hg</p>
        <p>Tipos: ${types}</p>
        <p>Habilidades: ${abilities}</p>
    `;
   
    pokemonCard.addEventListener('click', () => {
        const modal = document.getElementById('pokemon-modal');
        const modalContent = modal.querySelector('.modal-content');
   
        // Conteúdo do modal
        modalContent.innerHTML = `
            <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
            <p>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</p>
            <p>ID: ${pokemonData.id}</p>
            <p>Altura: ${pokemonData.height} dm</p>
            <p>Peso: ${pokemonData.weight} hg</p>
            <p>Tipos: ${types}</p>
            <p>Habilidades: ${abilities}</p>
        `;
   
        modal.style.display = 'block';
    });
 
    const closeModal = document.querySelector('.close');
    const modal = document.getElementById('pokemon-modal');
 
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
 
    pokemonContainer.appendChild(pokemonCard);
}
 
function clearPokemonList() {
    const pokemonContainer = document.getElementById('pokemon-list');
    pokemonContainer.innerHTML = '';
}
 
document.getElementById('search-button').addEventListener('click', () => {
    const searchInput = document.getElementById('search').value.toLowerCase();
 
    if (searchInput === '') {
        // Se a entrada de pesquisa estiver vazia, busque todos os Pokémon.
        clearPokemonList();
        fetchAllPokemon();
    } else {
        fetch(apiUrl + searchInput)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Pokémon não encontrado!');
                }
                return response.json();
            })
            .then(pokemonData => {
                clearPokemonList();
                createPokemonCard(pokemonData);
            })
            .catch(error => {
                console.error(error.message);
            });
    }
});
 
document.getElementById('search-button').addEventListener('click', performSearch);
document.getElementById('search').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});