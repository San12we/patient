import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { fontFamily } from '../constants/fontFamily'
import { fontSize, iconSize, spacing } from '../constants/dimensions'
// import { colors } from '../constants/color'

// icons
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from '@react-navigation/native';
import Colors from './Shared/Colors';

type CustomInputProps = {
    label: string,
    icon?: React.ReactElement,
    placeholder: string,
    type?: string
}
const CustomInput: React.FC<CustomInputProps> = ({ label, icon, placeholder, type, ...rest }) => {
    const [secureTextEntery, setSecureTextEntery] = useState(true);
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.inputLabel, {
                color: Colors.primary,
            }]}>{label}</Text>

            <View style={styles.inputFieldContainer}>
                {icon}
                {/* <Ionicons name={"mail-outline"} size={iconSize.md} color={colors.iconSecondary} style={styles.icon} /> */}
                <TextInput
                    style={[styles.textInput, { color:Colors.primary }]}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.SECONDARY}
                    secureTextEntry={type === "password" && secureTextEntery}

                />
                {
                    type === "password" && (
                        <TouchableOpacity onPress={() => setSecureTextEntery(!secureTextEntery)}>
                            <Feather
                                name={secureTextEntery ? "eye" : "eye-off"} size={iconSize.md}
                                color={Colors.SECONDARY}
                                style={styles.icon} />
                        </TouchableOpacity>
                    )
                }
            </View>

        </View>
    )
}

export default CustomInput

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.sm
    },
    inputLabel: {
        fontFamily: fontFamily.semiBold,
        fontSize: fontSize.md,
        marginVertical: spacing.sm
    },
    inputFieldContainer: {
        borderWidth: 1,
        borderColor: "#F1ECEC",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        padding: spacing.sm
    },
    icon: {
        marginRight: spacing.sm
    },

    textInput: {
        flex: 1,
        fontFamily: fontFamily.medium,
        fontSize: fontSize.md
    }
})