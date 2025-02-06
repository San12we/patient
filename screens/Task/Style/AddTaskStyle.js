import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";

export const styles = StyleSheet.create({
  addTaskContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundLight, // Use a softer background color
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryGradientStart,
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5, // For shadow effect
  },
  backArrow: {
    width: 24,
    height: 24,
    tintColor: Colors.white,
  },
  textAdd: {
    flex: 1,
    fontSize: 20,
    color: Colors.white,
    fontFamily: Fonts.BOLD,
    textAlign: "center",
    paddingRight: 40, // To offset arrow spacing
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: Colors.textDark,
    fontFamily: Fonts.BOLD,
    marginBottom: 5,
  },
  inputView: {
    marginBottom: 20,
  },
  Input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 14,
    color: Colors.textDark,
    elevation: 2,
    shadowColor: Colors.shadow,
  },
  dateView: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    elevation: 2,
    shadowColor: Colors.shadow,
  },
  calenderImgs: {
    width: 20,
    height: 20,
    tintColor: Colors.primary,
  },
  InputDate: {
    fontSize: 14,
    color: Colors.textDark,
  },
  shiftContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: Colors.shadow,
  },
  addShiftButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: Colors.shadow,
  },
  addShiftButtonText: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: Fonts.MEDIUM,
  },
  removeShiftButton: {
    backgroundColor: Colors.error,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    elevation: 3,
    shadowColor: Colors.shadow,
  },
  removeShiftButtonText: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: Fonts.MEDIUM,
  },
  btn: {
    backgroundColor: Colors.primaryGradientEnd,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    elevation: 3,
    shadowColor: Colors.shadow,
  },
  btnText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: Fonts.MEDIUM,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
  },
  previewContainer: {
    marginTop: 20,
  },
  previewTitle: {
    fontSize: 18,
    color: Colors.textDark,
    fontFamily: Fonts.BOLD,
    marginBottom: 10,
  },
  previewCard: {
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    elevation: 3,
    shadowColor: Colors.shadow,
    width: 200, // Set a fixed width for horizontal scrolling
  },
  previewCardTitle: {
    fontSize: 16,
    color: Colors.textDark,
    fontFamily: Fonts.BOLD,
    marginBottom: 5,
  },
  previewCardText: {
    fontSize: 14,
    color: Colors.textDark,
    fontFamily: Fonts.REGULAR,
  },
  // Add background colors for alternating cards
  cardBackground1: {
    backgroundColor: Colors.cardBackground1,
  },
  cardBackground2: {
    backgroundColor: Colors.cardBackground2,
  },
});
