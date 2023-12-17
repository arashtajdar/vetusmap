import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 3,
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
    fontSize: 12, // Corrected type to number
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
  filterContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    width: '30%',
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
  mapSectionMainView: {
    height: '100%',
    paddingTop: 45,
    backgroundColor: '#123456',
  },
  markerImageMainView: {
    width: 30,
    height: 30,
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
  markerCalloutView: {
    alignItems: 'center',
  },
  markerCalloutImage: {
    width: 150,
    height: 100,
  },
  mapMainRenderView: {
    flexDirection: 'column',
    flex: 1,
  },
  locationScreenImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  locationMainView: {
    width: '100%',
    height: '100%',
  },
  ProfileContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'center',
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  SettingsContainer: {
    flex: 1,
    padding: 16,
  },
  SettingsOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  markerCallout: {
    width: 200,
  },
  popupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  popupImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalMainContainer: {
    position: 'absolute',
    bottom: 35,
    width: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    zIndex: 100,
  },
  buttonOpen: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  filterCategoryName: {
    padding: 10,
    margin: 5,
  },
  filterCategoryNameSelected: {
    backgroundColor: '#15e536',
  },
  filterCategoryNameNotSelected: {
    backgroundColor: '#a1a1a1',
  },
  locationFavouriteView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 100,
  },

  locationFavouriteStarButton: {
    fontSize: 40,
    shadowOpacity: 10,
    textShadowRadius: 10,
    textShadowColor: '#000000',
    color: '#ffffff',
  },
  locationFavouriteStarButtonActive: {
    color: '#e8cb0a',
  },
  locationReviewView: {
    position: 'absolute',
    bottom: 20,
    left: 10,
  },
  locationReviewButton: {
    fontSize: 40,
    shadowOpacity: 10,
    textShadowRadius: 10,
    textShadowColor: '#000000',
    color: '#ffffff',
  },
  reviewList: {
    backgroundColor: '#c2efe9',
  },
  reviewListItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
  },
  reviewListUserReview: {
    backgroundColor: '#dbfcfa',
  },
  reviewListItemName: {
    fontWeight: '600',
  },
  reviewListItemScore: {
    paddingLeft: 5,
  },
  reviewListItemComment: {
    padding: 10,
  },
});
