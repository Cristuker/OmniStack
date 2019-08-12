 import React,{ useEffect, useState} from 'react'
 import { Text,SafeAreaView, Image , StyleSheet, View, TouchableOpacity } from 'react-native'
 import logo from '../assets/logo.png'
 import io from 'socket.io-client'
 import like from '../assets/like.png'
 import dislike from '../assets/dislike.png'
 import api from '../services/api'
 import AsyncStorage from '@react-native-community/async-storage'
 import itsamatch from '../assets/itsamatch.png'

 function Main({ navigation }){

    const id = navigation.getParam('id')
    const[users, setUsers] = useState([])
    const [matchDev, setMatchDev] = useState(true)

    useEffect(() =>{
      async function loadUsers(){
        const response = await api.get('/devs',{
            headers: { 
                user: id,
            }
        })
        setUsers(response.data)
      }  
      loadUsers();
    },[id])
    useEffect(()=>{
        const socket = io('http://10.0.3.2:3333',{
            query: { user: id }
        })

    socket.on('match',dev =>{
        setMatchDev(dev)
    })
    },[id])

    async function handleLike(){

        const [ user, ...rest ] = users;


        await api.post(`/devs/${user._id}/likes`, null , {
            headers: { user: id },
        })
        setUsers(rest)
    }

    async function handleDislike(){
        await api.post(`/devs/${id}/dislikes`, null , {
            headers: { user: id },
        })
        setUsers(users.filter(user => user._id !==id))
    }

    async function handleLogout(){
        await AsyncStorage.clear();
        navigation.navigate('Login')
    }

     return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout} >
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>
            <View style={styles.cardsContainer}>
                {users.length === 0 
                ? <Text style={styles.empty}> Acabou :( </Text>
                :(
                    users.map( (user,index) =>{
                        <View key={user._id} style={[styles.card, {zIndex:user.length - index }]}>
                            <Image source={{ uri:user.avatar }} />
                            <View style={styles.footer} >
                                <Text style={styles.name} >{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3} >{user.bio}</Text>
                            </View>
                        </View>
                    })
                )
            }
            </View>
            { users.length > 0 &&
                <View style={ styles.buttonsContainer}>
                <TouchableOpacity style={ styles.button} onPress={handleDislike} >
                    <Image source={dislike} />
                </TouchableOpacity>
                <TouchableOpacity style={ styles.button} onPress={handleLike}>
                    <Image source={like} />
                </TouchableOpacity>
            </View>
            }

            {matchDev &&(
                <View style={ styles.matchContainer}>
                    <Image source={itsamatch} source={}/>
                   
                    <Image style={styles.matchAvatar} source={{uri: 'https://avatars1.githubusercontent.com/u/32272832?v=4'}}/>
                    <Text style={styles.matchName}>Reginaldo Junior</Text>
                    <Text style={styles.matchBio}>React Developer and JavaScript ecosystem master</Text>
                    <TouchableOpacity onPress={()=> setMatchDev(null)} >
                        <Text style={styles.closeMatch}>Fechar</Text>
                    </TouchableOpacity>
                </View>

            )}

        </SafeAreaView>
     )
 }

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    logo:{
        marginTop:30
    },
    cardsContainer:{
        flex:1,
        alignSelf:'stretch',
        justifyContent: 'center',
        maxHeight:500,
        
    },
    card:{
        borderWidth:1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0
    },
    avatar:{
        flex:1,
        height:300
    },
    footer:{
        backgroundColor:'#FFF',
        paddingHorizontal: 20,
        paddingVertical:15,
    },
    name:{
        fontSize:16,
        fontWeight:'bold',
        color:'#333'
    },
    bio:{
        fontSize:14,
        color: '#999',
        marginTop:5,
        lineHeight:18
    },
    buttonsContainer:{
        flexDirection:'row',
        marginBottom:30,
    },
    button:{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,

    },
    empty:{
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold',
    }
})


 export default Main;