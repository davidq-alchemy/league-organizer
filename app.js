// Utils
import { protectPage } from './utils.js';

// Services
import { getUser, signOut } from './services/auth-service.js';
import { getTeams, addPlayer, deletePlayer } from './services/league-service.js';

// Components
import createUser from './components/User.js';
import createTeamList from './components/TeamList.js';

// State
let user = null;
let teams = [];

// Action Handlers
async function handlePageLoad() {
    user = getUser();
    if (protectPage(user)) return;

    teams = await getTeams();
    display();
}

async function handleSignOut() {
    signOut();
}

async function handleAddPlayer(name, team) {
    const teamId = team.id;

    const newPlayer = await addPlayer(name, teamId);
    teams.find(val => val.id === teamId)?.players.push(newPlayer);

    display();
}

async function handleDeletePlayer(player) {
    await deletePlayer(player);

    const teamPlayers = teams.find(val => val.id === player.teamId)?.players;
    const index = teamPlayers.indexOf(player);
    if (index !== -1) teamPlayers.splice(index, 1);

    display();
}

// Components
const User = createUser(
    document.querySelector('#user'),
    { handleSignOut }
);

const TeamList = createTeamList(
    document.querySelector('#team-list'),
    { handleAddPlayer, handleDeletePlayer }
);

function display() {
    User({ user });
    TeamList({ teams });
}

handlePageLoad();
