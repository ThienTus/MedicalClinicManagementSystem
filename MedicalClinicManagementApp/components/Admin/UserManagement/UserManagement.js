import { ActivityIndicator, Image, ScrollView, Text, View, TextInput, Button, StyleSheet } from "react-native";
import Style from "./Style";
import React, { useEffect, useState } from "react";
import API, { endpoints } from "../../../configs/API";
import MyStyles from "../../../styles/MyStyles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

const UserManagement = ({ route, navigation }) => {
    const [users, setUsers] = useState(null);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newAvatar, setNewAvatar] = useState("");
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [showUpdateUserForm, setShowUpdateUserForm] = useState(null);
    const [updatedUsername, setUpdatedUsername] = useState("");
    const [updatedPassword, setUpdatedPassword] = useState("");
    const [updatedFirstName, setUpdatedFirstName] = useState("");
    const [updatedLastName, setUpdatedLastName] = useState("");
    const [updatedAvatar, setUpdatedAvatar] = useState("");
    const [updatedScope, setUpdatedScope] = useState("");
    const [newScope, setNewScope] = useState("");


    const loadUsers = async () => {
        try {
            const response = await API.get(endpoints.users);
            setUsers(response.data);
        } catch (error) {
            console.error("Error loading Users:", error);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const createUsers = async () => {
        try {
            const response = await API.post(endpoints['register'], {
                username: newUsername,
                password: newPassword,
                first_name: newFirstName,
                last_name: newLastName,
                avatar: newAvatar,
                scope: newScope
            });
            console.log("Users created:", response.data);
            loadUsers();
            setShowCreateUser(false);
        } catch (error) {
            console.error("Error creating Users:", error);
        }
    };

    const cancelCreate = async () => {
        setShowCreateUser(false);
    }

    const updateUsers = async (id, newData) => {
        try {
            const response = await API.put(`${endpoints.users}${id}/update/`, newData);
            console.log("Users updated:", response.data);
            loadUsers();
        } catch (error) {
            console.error("Error updating Users:", error);
        }
    };

    const deleteUsers = async (id) => {
        try {
            const response = await API.delete(`${endpoints.users}${id}/`);
            console.log("Users deleted:", response.data);
            loadUsers();
        } catch (error) {
            console.error("Error deleting Users:", error);
        }
    };

    return (
        <View style={MyStyles.container}>
            <Text style={MyStyles.subject}>QUẢN LÝ TÀI KHOẢN</Text>
            <Button
                title="Tạo mới tài khoản"
                onPress={() => setShowCreateUser(true)}
            />
            <ScrollView>
                {users === null ? (
                    <ActivityIndicator />
                ) : (
                    <>
                        {users.map((user) => (
                            <View style={styles.medicineContainer} key={user.id}>
                                <TouchableOpacity onPress={() => {/* handle press */ }}>
                                    <Image
                                        source={{ uri: user.avatar }}
                                        style={styles.medicineImage}
                                    />
                                </TouchableOpacity>
                                <View style={styles.medicineDetails}>
                                    <Text style={styles.medicinePrice}>ID: {user.id}</Text>
                                    <TouchableOpacity onPress={() => {/* handle press */ }}>
                                        <Text style={styles.medicineName}>Tên đăng nhập: {user.username}</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.medicineDescription}>Họ và tên: {`${user.first_name} ${user.last_name}`}</Text>
                                    <Text style={styles.medicineDescription}>Quyền: {`${user.scope}`}</Text>

                                    {/* <Button
                                        style={styles.updateMedical}
                                        title="Cập nhật"
                                        onPress={() => {
                                            setShowUpdateMedicineForm(user.id);
                                            setUpdatedMedicineName(user.name);
                                            setUpdatedMedicineDescription(user.description);
                                            setUpdatedMedicinePrice(user.price.toString());
                                        }}
                                    /> */}
                                    <TouchableOpacity style={styles.buttonDelete} onPress={() => deleteUsers(user.id)}><Text style={styles.deleteButtonText}>Xóa</Text></TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>
            {showCreateUser && (
                <View>
                    <Text style={MyStyles.subject}>Tạo mới người dùng</Text>
                    <TextInput
                        value={newUsername}
                        onChangeText={setNewUsername}
                        placeholder="Tên người dùng"
                        style={styles.input}
                    />
                    <TextInput
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Mật khẩu"
                        secureTextEntry={true}
                        style={styles.input}
                    />
                    <TextInput
                        value={newFirstName}
                        onChangeText={setNewFirstName}
                        placeholder="Họ"
                        style={styles.input}
                    />
                    <TextInput
                        value={newLastName}
                        onChangeText={setNewLastName}
                        placeholder="Tên"
                        style={styles.input}
                    />
                    <TextInput
                        value={newAvatar}
                        onChangeText={setNewAvatar}
                        placeholder="Ảnh đại diện"
                        style={styles.input}
                    />

                    <Picker
                        selectedValue={newScope}
                        onValueChange={(value) => setNewScope(value)}
                        style={styles.picker}
                        itemTextStyle={{ fontSize: 18, color: 'blue' }}
                    >
                        <Text style={styles.pickerItem} label="Admin" value="admin">Admin</Text>
                        <Text style={styles.pickerItem} label="Bác sĩ" value="doctor">Bác sĩ</Text>
                        <Text style={styles.pickerItem} label="Y tá" value="nurse">Y tá</Text>
                        <Text style={styles.pickerItem} label="Bệnh nhân" value="patient">Bệnh nhân</Text>
                    </Picker>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={createUsers}
                        >
                            <Text style={styles.buttonText}>Tạo mới</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={cancelCreate}
                        >
                            <Text style={styles.buttonText}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}


            {showUpdateUserForm && (
                <View>
                    <Text style={MyStyles.subject}>Cập nhật người dùng</Text>
                    <TextInput
                        value={updatedUsername}
                        onChangeText={setUpdatedUsername}
                        placeholder="Tên người dùng"
                        style={styles.input}
                    />
                    <TextInput
                        value={updatedPassword}
                        onChangeText={setUpdatedPassword}
                        placeholder="Mật khẩu"
                        secureTextEntry={true}
                        style={styles.input}
                    />
                    <TextInput
                        value={updatedFirstName}
                        onChangeText={setUpdatedFirstName}
                        placeholder="Họ"
                        style={styles.input}
                    />
                    <TextInput
                        value={updatedLastName}
                        onChangeText={setUpdatedLastName}
                        placeholder="Tên"
                        style={styles.input}
                    />
                    <TextInput
                        value={updatedAvatar}
                        onChangeText={setUpdatedAvatar}
                        placeholder="Ảnh đại diện"
                        style={styles.input}
                    />
                    <TextInput
                        value={updatedScope}
                        onChangeText={setUpdatedScope}
                        placeholder="Scope"
                        style={styles.input}
                    />
                    <Button
                        title="Lưu"
                        onPress={() => {
                            updateUsers(showUpdateUserForm, {
                                username: updatedUsername,
                                password: updatedPassword,
                                first_name: updatedFirstName,
                                last_name: updatedLastName,
                                avatar: updatedAvatar,
                                scope: updatedScope
                            });
                            setShowUpdateUserForm(null);
                        }}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    picker: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    pickerItem: {
        fontSize: 18,
        color: 'blue',
    },
    buttonDelete: {
        backgroundColor: "red",
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    createButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: 150,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: 150,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    updateMedical: {
        marginBottom: 5
    },
    medicineContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    medicineImage: {
        width: 80,
        height: 80,
        marginRight: 10,
    },
    medicineDetails: {
        flex: 1,
    },
    medicineName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    medicineDescription: {
        marginBottom: 5,
    },
    medicinePrice: {
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});

export default UserManagement;
