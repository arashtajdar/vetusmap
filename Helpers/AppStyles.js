// AppStyles.js

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 3,
    },
    button: {
        backgroundColor: '#123456',
        padding: 10,
        borderRadius: 5,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    absoluteFillObject: {
        fontSize: 12,  // Corrected type to number
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1,
    },
    bottomTextContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1,
    },
    bottomText: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
    bottomTextInfo: {
        color: '#0aad00',
    },
    bottomTextError: {
        color: '#f80025',
    },
});
