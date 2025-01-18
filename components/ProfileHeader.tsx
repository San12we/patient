import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

// icons
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import { iconSize } from '../constants/dimensions';
import { useNavigation, useTheme } from '@react-navigation/native';
import Colors from './Shared/Colors';

const ProfileHeader = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();

    // const hanleOpenSetting = () => {
    //     navigation.navigate("SETTING_SCREEN")
    // }
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Ionicons name={"arrow-back"} color={Colors.SECONDARY} size={iconSize.md} />
            </TouchableOpacity>

            <TouchableOpacity>
                <Octicons name={"gear"} color={Colors.SECONDARY} size={iconSize.md} />
            </TouchableOpacity>
        </View>
    )
}

export default ProfileHeader

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
})