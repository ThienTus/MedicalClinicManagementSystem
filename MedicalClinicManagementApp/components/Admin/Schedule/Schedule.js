import { useEffect, useState } from "react";
import { ScrollView, Text, View, Button, TextInput, StyleSheet,TouchableOpacity } from "react-native";
import API, { endpoints } from "../../../configs/API";
import { Picker } from "@react-native-picker/picker";

const Schedule = ({ route, navigation }) => {
    const [schedules, setSchedules] = useState(null);
    const [showCreateSchedule, setShowCreateSchedule] = useState(false);
    const [newSchedule, setNewSchedule] = useState({
        doctor: "",
        nurse: "",
        date: "",
        shift: "",
    });

    const loadSchedules = async () => {
        try {
            const response = await API.get(endpoints.schedules);
            setSchedules(response.data);
        } catch (error) {
            console.error("Error loading schedules:", error);
        }
    };

    useEffect(() => {
        loadSchedules();
    }, []);

    const handleChange = (field, value) => {
        setNewSchedule({ ...newSchedule, [field]: value });
    };

    const createSchedule = async () => {
        try {
            const response = await API.post(endpoints.schedules, newSchedule);
            console.log("Schedule created:", response.data);
            loadSchedules();
            setShowCreateSchedule(false);
        } catch (error) {
            console.error("Error creating schedule:", error);
        }
    };

    const deleteSchedule = async (id) => {
        try {
            const response = await API.delete(`${endpoints.schedules}${id}/`);
            console.log("Schedule deleted:", response.data);
            loadSchedules();
        } catch (error) {
            console.error("Error deleting schedule:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.subject}>LỊCH TRÌNH</Text>
            {showCreateSchedule ? (
                <View style={styles.createScheduleForm}>
                    <Text style={styles.subject}>Tạo Lịch Mới</Text>
                    <TextInput
                        value={newSchedule.doctor}
                        onChangeText={(value) => handleChange("doctor", value)}
                        placeholder="Bác sĩ"
                        style={styles.input}
                    />
                    <TextInput
                        value={newSchedule.nurse}
                        onChangeText={(value) => handleChange("nurse", value)}
                        placeholder="Y tá"
                        style={styles.input}
                    />
                    <TextInput
                        value={newSchedule.date}
                        onChangeText={(value) => handleChange("date", value)}
                        placeholder="Ngày"
                        style={styles.input}
                    />
                    <View style={styles.card}>
                        <Picker
                            selectedValue={newSchedule.shift}
                            onValueChange={(value) => handleChange("shift", value)}
                            style={styles.picker}
                            itemTextStyle={{ fontSize: 18, color: 'blue' }}
                        >
                            <Text style={styles.pickerItem} label="Morning" value="Morning">Buổi sáng</Text>
                            <Text style={styles.pickerItem} label="Afternoon" value="Afternoon">Buổi chiều</Text>
                            <Text style={styles.pickerItem} label="Night" value="Night">Buổi tối</Text>
                        </Picker>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Button title="Tạo Lịch" onPress={createSchedule} />
                        <Button title="Đóng" onPress={() => setShowCreateSchedule(false)} />
                    </View>
                </View>
            ) : (
                <Button
                    title="Tạo Lịch Mới"
                    onPress={() => setShowCreateSchedule(true)}
                />
            )}
            <ScrollView>
                {schedules !== null && schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <View key={schedule.id} style={styles.scheduleItem}>
                            <Text style={styles.scheduleText}>Bác sĩ: {schedule.doctor}</Text>
                            <Text style={styles.scheduleText}>Y tá: {schedule.nurse}</Text>
                            <Text style={styles.scheduleText}>Ngày: {schedule.date}</Text>
                            <Text style={styles.scheduleText}>Buổi: {schedule.shift}</Text>
                            <TouchableOpacity onPress={() => deleteSchedule(schedule.id)} style={styles.deleteButton}>
                                <Text style={styles.deleteButtonText}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text>Không tìm thấy lịch trình.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    scheduleItem: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    scheduleText: {
        fontSize: 16,
        marginBottom: 5,
    },
    deleteButton: {
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
    pickerItem: {
        fontSize: 18,
        color: 'blue',
    },
    card: {
        borderWidth: 1,
        width: '100%',
        borderColor: "rgba(155,155,155,1)",
        borderRadius: 5,
        backgroundColor: "rgba(214,210,210,1)",
        marginTop: 5,
        padding: 10, 
    },
    picker: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    subject: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    createScheduleForm: {
        marginTop: 20,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    scheduleItem: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    scheduleText: {
        fontSize: 16,
        marginBottom: 5,
    },
    deleteButton: {
        backgroundColor: "red",
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    deleteButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});



export default Schedule;
