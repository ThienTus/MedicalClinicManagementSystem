import { ActivityIndicator, Image, ScrollView, Text, View, TextInput, Button, StyleSheet } from "react-native";
import Style from "./Style";
import React, { useEffect, useState } from "react";
import API, { endpoints } from "../../../configs/API";
import MyStyles from "../../../styles/MyStyles";
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";

const Home = ({ route, navigation }) => {
    const [medicines, setMedicines] = useState(null);
    const [newMedicineName, setNewMedicineName] = useState("");
    const [newMedicineDescription, setNewMedicineDescription] = useState("");
    const [newMedicinePrice, setNewMedicinePrice] = useState("");
    const [showCreateMedicine, setShowCreateMedicine] = useState(false);
    const [showUpdateMedicineForm, setShowUpdateMedicineForm] = useState(null);
    const [updatedMedicineName, setUpdatedMedicineName] = useState("");
    const [updatedMedicineDescription, setUpdatedMedicineDescription] = useState("");
    const [updatedMedicinePrice, setUpdatedMedicinePrice] = useState("");

    const loadMedicines = async () => {
        try {
            const response = await API.get(endpoints.medicines);
            setMedicines(response.data);
        } catch (error) {
            console.error("Error loading medicines:", error);
        }
    };

    useEffect(() => {
        loadMedicines();
    }, []);

    const cancelCreate = async () => {
        setShowCreateMedicine(false);
    }

    const createMedicine = async () => {
        try {
            const response = await API.post(endpoints.medicinesCreate, {
                name: newMedicineName,
                description: newMedicineDescription,
                price: parseFloat(newMedicinePrice)
            });
            console.log("Medicine created:", response.data);
            loadMedicines();
            setShowCreateMedicine(false);
        } catch (error) {
            console.error("Error creating medicine:", error);
        }
    };

    const updateMedicine = async (id, newData) => {
        try {
            const response = await API.put(`${endpoints.medicines}${id}/update/`, newData);
            console.log("Medicine updated:", response.data);
            loadMedicines();
        } catch (error) {
            console.error("Error updating medicine:", error);
        }
    };

    const deleteMedicine = async (id) => {
        try {
            const response = await API.delete(`${endpoints.medicines}${id}/delete/`);
            console.log("Medicine deleted:", response.data);
            loadMedicines();
        } catch (error) {
            console.error("Error deleting medicine:", error);
        }
    };

    return (
        <View style={MyStyles.container}>
            <Text style={MyStyles.subject}>DANH MỤC THUỐC</Text>
            <Button
                title="Tạo mới thuốc"
                onPress={() => setShowCreateMedicine(true)}
            />
            <ScrollView>
                {medicines === null ? (
                    <ActivityIndicator />
                ) : (
                    <>
                        {medicines.map((medicine) => (
                            <View style={styles.medicineContainer} key={medicine.id}>
                                <TouchableOpacity onPress={() => {/* handle press */ }}>
                                    <Image
                                        source={{ uri: "https://i.ibb.co/0h2xgQB/thuoc-vien-1-16919846518291434355354.webp" }}
                                        style={styles.medicineImage}
                                    />
                                </TouchableOpacity>
                                <View style={styles.medicineDetails}>
                                    <TouchableOpacity onPress={() => {/* handle press */ }}>
                                        <Text style={styles.medicineName}>{medicine.name}</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.medicineDescription}>{medicine.description}</Text>
                                    <Text style={styles.medicinePrice}>Price: {medicine.price}</Text>
                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity
                                            style={[styles.button, styles.updateMedical]}
                                            onPress={() => {
                                                setShowUpdateMedicineForm(medicine.id);
                                                setUpdatedMedicineName(medicine.name);
                                                setUpdatedMedicineDescription(medicine.description);
                                                setUpdatedMedicinePrice(medicine.price.toString());
                                            }}
                                        >
                                            <Text style={styles.buttonText}>Cập nhật</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.button, styles.deleteMedical]}
                                            onPress={() => deleteMedicine(medicine.id)}
                                        >
                                            <Text style={styles.buttonText}>Xóa</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>
            {showCreateMedicine && (
                <View>
                    <Text style={MyStyles.subject}>Tạo mới thuốc</Text>
                    <TextInput
                        value={newMedicineName}
                        onChangeText={setNewMedicineName}
                        placeholder="Tên thuốc"
                        style={styles.input}
                    />
                    <TextInput
                        value={newMedicineDescription}
                        onChangeText={setNewMedicineDescription}
                        placeholder="Mô tả"
                        style={styles.input}
                    />
                    <TextInput
                        value={newMedicinePrice}
                        onChangeText={setNewMedicinePrice}
                        placeholder="Giá"
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={createMedicine}
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

            {showUpdateMedicineForm && (
                <View>
                    <Text style={MyStyles.subject}>Cập nhật thuốc</Text>
                    <TextInput
                        value={updatedMedicineName}
                        onChangeText={setUpdatedMedicineName}
                        placeholder="Tên thuốc"
                        style={styles.input}
                    />
                    <TextInput
                        value={updatedMedicineDescription}
                        onChangeText={setUpdatedMedicineDescription}
                        placeholder="Mô tả"
                        style={styles.input}
                    />
                    <TextInput
                        value={updatedMedicinePrice}
                        onChangeText={setUpdatedMedicinePrice}
                        placeholder="Giá"
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <Button
                        title="Lưu"
                        onPress={() => {
                            updateMedicine(showUpdateMedicineForm, {
                                name: updatedMedicineName,
                                description: updatedMedicineDescription,
                                price: parseFloat(updatedMedicinePrice)
                            });
                            setShowUpdateMedicineForm(null);
                        }}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    button: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    updateMedical: {
        backgroundColor: 'green',
        width: 140,
        maxWidth: '100%'
    },
    deleteMedical: {
        backgroundColor: "red",
        width: 140,
        maxWidth: '100%'
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
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

export default Home;
