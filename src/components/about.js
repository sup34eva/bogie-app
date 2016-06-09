import React from 'react';
import {
    Platform,
    View,
    Text,
    Image,
    Field,
    StyleSheet
} from 'react-native';
const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        width: 1080,
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingTop:0,
        padding: 45,
        marginTop: 45
    },
    title: {
        fontWeight: 'bold',
        marginTop: 45
    },
    about :{
        backgroundSize : 'cover',
        backgroundImage : 'url("/about.jpg")',
        height: '100vh'
    }

});

export default class About extends React.Component {
    static propTypes = {
        onConnect: React.PropTypes.func,
        style: View.propTypes.style
    };
    render() {
        return (
            <View>
            <View style={styles.about}>
                <View style={styles.container}>
                    <Text style={styles.title}>1.Installation</Text>
                            <Text>Avant de pouvoir utiliser l’application mobile Bogie, il faut commencer par la
                            télécharger sur le Store de Google Play.
                            Une fois le téléchargement terminé, il vous suffit de lancer l’application en
                            cliquant sur l’icône.</Text>
                    <Text style={styles.title}>2.Identification</Text>
                            <Text>Une fois l’application lancée, la première étape est de s’identifier.
                            Vous arrivez donc sur une page de login.
                            Si vous êtes déjà inscrit, il vous suffit de renseigner votre email
                            ainsi que votre mot de passe de connexion. Vous pouvez également
                            vous connecter avec votre compte Facebook ou Google +.
                            Si il s’agit de votre première visite, l’onglet ‘’Register’’ vous
                            permet de créer un compte sur l’application. Pour vous inscrire,
                             il vous est demander une adresse mail ainsi qu’un un mot de passe.
                             </Text>
                    <Text style={styles.title}>3.Page d’accueil</Text>

                            <Text>Lorsque vous êtes connecté, vous avez accès à une page d’accueil
                            Page d’accueil avec la liste des trains : possibilité de filtrer
                            On peut ensuite sélectionner un trajet, le mettre dans notre panier
                            Accès a un historique
                            On peut consulter le panier à n’importe quel moment.
                            Une fois la sélection terminée, on valide le panier puis on passe au payement.
                            Possibilité d’imprimer les billets de train.
                            Le payement est effectué par PayPal
                    </Text>
                </View>
            </View>
            </View>

);
}
}
