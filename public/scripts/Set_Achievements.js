function getUsernameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('username'); // Holt den Wert des Parameters "username"
}


async function fetchData() {

    const username = getUsernameFromURL(); // Den Benutzernamen aus der URL holen

    if (!username) {
        console.error("Kein Benutzername in der URL gefunden!");
        return; // Stoppe die Funktion, falls kein Benutzername in der URL vorhanden ist
    }

    try{

        const response = await fetch('172.16.2.165:3000/users?username=${username}');

        if(!response.ok){
            throw new Error('Failed to fetch users');
        }

        //Fill constants with data

        const data = await response.json();
        const user = data[0];
        const userData_Username = data.username;
        const userData_Best_Placement = data.best_placement;
        const userData_beat_level1 = data.beat_level1;
        const userData_beat_level2 = data.beat_level2;
        const userData_beat_level3 = data.beat_level3;


        const UserName = document.getElementById('username');

        //Get Medal Objects
        const GoldMedal = document.getElementById('Gold-Medal');
        const SilverMedal = document.getElementById('Silver-Medal');
        const BronzeMedal = document.getElementById('Bronze-Medal');

        //Get Trophy Objects
        const GoldTrophy = document.getElementById('Gold-Trophy');
        const SilverTrophy = document.getElementById('Silver-Trophy');
        const BronzeTrophy = document.getElementById('Bronze-Trophy');


        UserName.innerHTML = userData_Username;


        //check if user finished any levels
        if(userData_beat_level3 === true){
            GoldMedal.style.display = 'block';
        }
        if(userData_beat_level2 === true){
            SilverMedal.style.display = 'block';
        }
        if(userData_beat_level1 === true){
            BronzeMedal.style.display = 'block';
        }

        //check if user was ever on scoreboard if true set free achievements
        if(userData_Best_Placement === 1){
            BronzeTrophy.style.display = 'block';
            SilverTrophy.style.display = 'block';
            GoldTrophy.style.display = 'block';
        }
        else if(userData_Best_Placement === 2){
            SilverTrophy.style.display = 'block';
            BronzeTrophy.style.display = 'block';
        }
        else if(userData_Best_Placement === 3){
            BronzeTrophy.style.display = 'block';
        }

    }catch(error){
        console.log(error);
    }

}