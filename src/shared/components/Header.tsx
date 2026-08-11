import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

type HeaderProps = {
	title?: string;
	subtitle?: string;
	onPressNotification?: () => void;
	onPressProfile?: () => void;
};

export default function Header({
	title = 'CRM',
	onPressNotification,
	onPressProfile,

}: HeaderProps) {
	return (
			<View style={styles.container}>
				<View style={styles.logoArea}>
					<Image
						source={require('../../../assets/logo-samasi.png')}
						resizeMode="contain"
						style={styles.logo}
						/>
					<Image
						source={require('../../../assets/samasi-text.png')}
						resizeMode="contain"
						style={styles.logoText}
						/>
					{title && <Text style={styles.titleText}>{title}</Text>}
				</View>

				<View style={styles.rightArea}>
					<TouchableOpacity
						onPress={onPressNotification}
						style={styles.iconButton}
						activeOpacity={0.8}
						>
						<Feather name="bell" size={22} color="#0F172A" />
					</TouchableOpacity>
					<TouchableOpacity 
						onPress={onPressProfile}
						style={styles.iconButton}
						activeOpacity={0.8}
						>
						<FontAwesome name="user-circle-o" size={32} color="#000" />
					</TouchableOpacity>
				</View>
			</View>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: '#FFFFFF',
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 20,
		paddingLeft: 5,
		paddingBottom: -10,
		paddingTop: -50,
		marginLeft: 0,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#E2E8F0',
	},
	rightArea: {
		alignItems: 'flex-end',
		flexDirection: 'row',
	},
	iconButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	logoArea: {
		alignItems: 'center',
		flexDirection: 'row',
		margin: -10,
	},
	logo: {
		width: 80,
		height: 80,
	},
	logoText: {
		width: 80,
		height: 80,
		marginLeft: -15,
	},
	titleText: {
		fontSize: 10,
		fontWeight: 'bold',
		color: '#FFF',
		backgroundColor: '#2775c0',
		marginLeft: 10,
		padding: 5,
		borderRadius: 99,
	}
});