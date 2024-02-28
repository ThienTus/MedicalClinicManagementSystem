import { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Image, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MyStyles from "../../styles/MyStyles";
import Style from "./Style";
import * as ImagePicker from 'expo-image-picker';
import API, { endpoints } from "../../configs/API";
import axios from "axios";
import * as FileSystem from 'expo-file-system';

const Register = ({ navigation }) => {
    const [user, setUser] = useState({
        "first_name": "",
        "last_name": "",
        "username": "",
        "password": "",
        "avatar": "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
        "scope": "patient"
    });

    const [loading, setLoading] = useState(false);

    const register = async () => {

        setLoading(true);

        try {
            console.log(user);
            let res = await API.post(endpoints['register'], user);
            console.log(res.data);
            setLoading(false);
            navigation.navigate("Login");
            Alert.alert("Đăng ký thành công");
        } catch (ex) {
            console.error(ex);
            Alert.alert("Đăng ký thất bại");
        } finally {
            setLoading(false);
        }
    }

    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permission Denied!");
        } else {
            let res = await ImagePicker.launchImageLibraryAsync();
            console.log(res.assets[0]);

            if (!res.canceled) {
                let base64ImageData = await FileSystem.readAsStringAsync(res.assets[0].uri, { encoding: 'base64' });

                const form = new FormData();
                form.append('image', base64ImageData);

                axios.post('https://api.imgbb.com/1/upload?expiration=15552000&key=e64a49ca517de7491f78d8edf586515a', form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }).then(response => {
                    console.log(response.data.data.url);
                    change("avatar", response.data.data.url);

                }).catch(error => {
                    console.error(error);
                });

            }
        }
    }

    const change = (field, value) => {
        setUser(current => {
            return { ...current, [field]: value }
        })
    }

    return (
        <View style={MyStyles.container}>
            <Text style={MyStyles.subject}>ĐĂNG KÝ</Text>

            <TextInput value={user.first_name} onChangeText={t => change("first_name", t)} style={Style.input} placeholder="Tên..." />
            <TextInput value={user.last_name} onChangeText={t => change("last_name", t)} style={Style.input} placeholder="Họ và tên lót..." />
            <TextInput value={user.username} onChangeText={t => change("username", t)} style={Style.input} placeholder="Tên đăng nhập..." />
            <TextInput secureTextEntry={true} value={user.password} onChangeText={t => change("password", t)} style={Style.input} placeholder="Mật khẩu..." />
            <TextInput secureTextEntry={true} style={Style.input} placeholder="Xác nhận mật khẩu..." />
            <TouchableOpacity style={Style.input} onPress={picker}>
                <Text>Chọn ảnh đại diện...</Text>
            </TouchableOpacity>

            {user.avatar ? <Image style={Style.avatar} source={{ uri: user.avatar }} /> : ""}

            <TouchableOpacity onPress={register}>
                <Text style={Style.button}>Đăng ký</Text>
            </TouchableOpacity>

        </View>
    );
}

export default Register;