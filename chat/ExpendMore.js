import React,{useState, useEffect} from 'react';
import { View, Modal,   ScrollView, Text,   StyleSheet,    Button, TouchableOpacity } from 'react-native';
import {expendStyles} from '../../components/styles/chatS';
import {expendStylesD} from '../../components/darkStyle/chatD';
import {
    getConnectedAgentAreas,
    postfetchWorkflowSettings,
    postPassiveChangeErrandArea,
    postChangeErrandInternalState,
  } from '../../../config/api';


const ExpendMore = ({ data,areaId, id,cipherKey, isDarkMode}) => {
  // console.log('Expeeeend', isDarkMode)
  const expendStyle = isDarkMode ? expendStylesD : expendStyles;
    const [moreData, setMoreData] = useState(null);
    const [state , setState] = useState([])
    const [isAreaPressed, setIsAreaPressed] =useState(false)
    const [isStatePressed, setIsStatePressed] =useState(false)
    const [selectedState, setSelectedState] =useState('-')
    const [connectedArea, setConnectedArea] = useState([])
    useEffect(() => {
        setMoreData(data)
        fetchData()
    },[])
    const fetchData = async () => {
        getConnectedAgentArea()
    }
    const handleOverlayPress = () => {
        setIsStatePressed(false)
        setIsAreaPressed(false)

      };
    const getConnectedAgentArea = async () => {
        const result = await getConnectedAgentAreas();
        // console.log('==================[[]]=============', result);
        const area = result.areas.find(a => a.Name === areaId);
        const AreaInfo = area.Areas.map(area => ({Name: area.Name, Id: area.Id}));
        setConnectedArea(AreaInfo)    
        const fetchparameters = await postfetchWorkflowSettings();
        const dataWorkFlow= fetchparameters.errandStates
        const stateData = Object.values(dataWorkFlow).map(item => ({ id: item.key, name: item.name }));
        const selectedStatus = stateData.find(item => item.id === data?.state);
        setSelectedState(selectedStatus.name)
        setState(stateData);
        
      }
      const handlestateSelect= async (list)  =>{
        const result = await postChangeErrandInternalState(id , list.id,list.name)
        // console.log(']]]handlestateSelect=====',result)
        setSelectedState(list.name)
        setIsStatePressed(false)
      }
      const handleConnectedAreaSelect = async (list) =>{
        const result = await postPassiveChangeErrandArea(list.Id,id,cipherKey)
        // console.log(']]]]]]]]]]]]]]=====>>>>>',{result})
        
        setMoreData((prevData) => ({
          ...prevData,
          area: list.Name,
        }));
        setIsAreaPressed(false)
      }
  return (
<View style={expendStyle.convBar}>
<View style={expendStyle.row}>
  <Text style={expendStyle.label}>Date:</Text>
  <Text style={expendStyle.value}>{moreData?.date}</Text>
</View>

{/* <View style={expendStyle.row}>
  <Text style={expendStyle.label}>STATUS:</Text>
  <Text style={expendStyle.greenColor}>{moreData?.status}</Text>
</View> */}

<View style={expendStyle.row}>
  <Text style={expendStyle.label}>From:</Text>
  <Text style={expendStyle.value}>{moreData?.from}</Text>
</View>

<View style={expendStyle.row}>
  <Text style={expendStyle.label}>Attach:</Text>
  <Text style={expendStyle.value}>{moreData?.attach}</Text>
</View>

<View style={expendStyle.row}>
  <Text style={expendStyle.label}>Copy to:</Text>
  <Text style={expendStyle.value}>{moreData?.to}</Text>
</View>

<View style={expendStyle.row}>
  <Text style={expendStyle.label}>State:</Text>
  <TouchableOpacity onPress={()=>setIsStatePressed(true)}>
  <Text style={expendStyle.underline}>{selectedState}</Text>
  </TouchableOpacity>
</View>

<Modal
          transparent={true}
          animationType="none"
          visible={isStatePressed}
          // onRequestClose={handleCloseDropdown2}
          >
          <TouchableOpacity
            style={expendStyle.overlay}
            activeOpacity={1}
            onPress={handleOverlayPress}
            ></TouchableOpacity>
        
            <View style={expendStyle.dropdownMenu1}>
              <ScrollView
                style={expendStyle.bodyContainer}
                horizontal
                showsHorizontalScrollIndicator={false}>
                <View style={expendStyle.pad}>
                  {state.map(list => (
                    <TouchableOpacity
                      style={expendStyle.dropdownItem2}
                      onPress={ ()=>
                        handlestateSelect(list)
                      }
                       
                   
                      >
                      <Text style={expendStyle.dropdownText}>
                        {list.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
        </Modal>

<View style={expendStyle.row}>
  <Text style={expendStyle.label}>area:</Text>
  <TouchableOpacity onPress={()=>setIsAreaPressed(true)}>
  <Text style={expendStyle.underline}>{moreData?.area}</Text>
  </TouchableOpacity>
</View>
<Modal
          transparent={true}
          animationType="none"
          visible={isAreaPressed}
          // onRequestClose={handleCloseDropdown2}
          >
          <TouchableOpacity
            style={expendStyle.overlay}
            activeOpacity={1}
            onPress={handleOverlayPress}
            ></TouchableOpacity>
        
            <View style={expendStyle.dropdownMenu2}>
              <ScrollView
                style={expendStyle.bodyContainer}
                horizontal
                showsHorizontalScrollIndicator={false}>
                <View style={expendStyle.pad}>
                  {connectedArea.map(list => (
                    <TouchableOpacity
                      style={expendStyle.dropdownItem2}
                      onPress={ ()=>
                        handleConnectedAreaSelect(list)
                      } 
                      >
                      <Text style={expendStyle.dropdownText}>
                        {list.Name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
        </Modal>
</View>
  );
};

export default ExpendMore;