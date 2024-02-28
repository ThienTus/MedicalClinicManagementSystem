import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useState } from "react";
import { View, Text, TextInput, Touchable, StyleSheet, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import API, { authApi, endpoints } from "../../configs/API";
import MyContext from "../../configs/MyContext";
import MyStyles from "../../styles/MyStyles";
import Style from "./Style";
import axios from 'axios';
import config from '../../configApi';

const Login = ({ navigation }) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const [user, dispatch] = useContext(MyContext);

    const login = async () => {
        setLoading(true);

        try {
            const response = await API.post(endpoints['login'],  {
                "username": username,
                "password": password,
            });
            Alert.alert(response.data.scope);

            console.log(response.data.scope);
            await AsyncStorage.setItem("access-token", response.data.access_token);

            if(response.data.scope == "Admin Scope Description"){
                await AsyncStorage.setItem("access-token", response.data.access_token);

                let user = await authApi(response.data.access_token).get(endpoints['current-user']);
                console.log(user.data.id);
                await AsyncStorage.setItem("user", user.data.id.toString());

                dispatch({
                    type: "login",
                    payload: response.data.scope
                });
                navigation.navigate("Home");
            }

            if(response.data.scope == "Patient Scope Description"){
                await AsyncStorage.setItem("access-token", response.data.access_token);

                let user = await authApi(response.data.access_token).get(endpoints['current-user']);
                console.log(user.data.id);
                await AsyncStorage.setItem("user", user.data.id.toString());

                dispatch({
                    type: "login",
                    payload: response.data.scope
                });
                navigation.navigate("SchedulePatient");
            }

            if(response.data.scope == "Nurse Scope Description"){
                await AsyncStorage.setItem("access-token", response.data.access_token);

                let user = await authApi(response.data.access_token).get(endpoints['current-user']);
                console.log(user.data.id);
                await AsyncStorage.setItem("user", user.data.id.toString());

                dispatch({
                    type: "login",
                    payload: response.data.scope
                });
                navigation.navigate("ApproveSchedule");
            }

            if(response.data.scope == "Doctor Scope Description"){
                await AsyncStorage.setItem("access-token", response.data.access_token);

                let user = await authApi(response.data.access_token).get(endpoints['current-user']);
                console.log(user.data.id);
                await AsyncStorage.setItem("user", user.data.id.toString());

                dispatch({
                    type: "login",
                    payload: response.data.scope
                });
                navigation.navigate("ScheduleDoctor");
            }

            

           
        } catch (ex) {
            console.log(ex);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
        <Text style={styles.subject}>ĐĂNG NHẬP</Text>

        <TextInput
            value={username}
            onChangeText={t => setUsername(t)}
            style={styles.input}
            placeholder="Tên đăng nhập..."
        />
        <TextInput
            secureTextEntry={true}
            value={password}
            onChangeText={t => setPassword(t)}
            style={styles.input}
            placeholder="Mật khẩu..."
        />

        <TouchableOpacity onPress={login} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        margin: 20
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10
    },
    buttonContainer: {
        backgroundColor: "blue",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        textAlign: "center"
    },
    subject: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        color: "blue",
        marginBottom: 20
    }
});

export default Login;