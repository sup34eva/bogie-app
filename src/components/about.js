import React from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import Card from './base/card';

const cdnUrl = `${process.env.CDN_URL}${(process.env.HEROKU_SLUG_COMMIT ? `/${process.env.HEROKU_SLUG_COMMIT}` : '')}`;

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        width: 1080,
        marginTop: 45
    },
    title: {
        fontWeight: 'bold',
        marginTop: 45
    },
    first: {
        marginTop: 0
    },
    about: {
        backgroundSize: 'cover',
        backgroundImage: `url('${cdnUrl}/about.jpg')`,
        flex: 1,
        zIndex: -1
    }
});

export default class about extends React.Component {
    static propTypes = {
        onConnect: React.PropTypes.func,
        style: View.propTypes.style
    };
    render() {
        return (
            <View style={styles.about}>
                <Card style={styles.container}>
                    <Text style={[styles.title, styles.first]}>Qui sommes-nous ?</Text>
                    <Text>
                        Nous sommes 4 étudiants en 3ème année d’école ingénieur informatique.
                        Nous possédons grâce à notre cursus de multiple connaissance sur les nouvelles technologies.
                        Passionné par le développement et essentiellement par le web, nous formons : The Rolling Stocks !
                    </Text>

                    <Text style={styles.title}>Que proposons-nous ? </Text>
                    <Text>
                        Ce que nous proposons ? ça tiens en un seul mot : Bogie.
                        Bogie c’est une application et un site web, qui vous permettent de gérer simplement vos trajets en trains.
                     </Text>

                    <Text style={styles.title}>Comment nous contacter ?</Text>
                    <Text>
                        Nous contacter ? Rien d’aussi simple !
                        Nous sommes à votre disposition à cette adresse mail : contact@bogie.leops.me.
                        Pour toutes questions ou remarques, n’hésitez pas.
                    </Text>
                </Card>
            </View>
        );
    }
}
