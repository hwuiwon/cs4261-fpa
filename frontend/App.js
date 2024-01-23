import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text, FlatList, TouchableOpacity, Modal} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoInputModal from './TodoInputModal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Perform login logic here
    navigation.navigate('ToDoList');
  };

  return (
    <View style={styles.container}>
      <FontAwesome5 name="fish" size={120} color="#000" solid style={styles.iconStyle} />
      <Text>Sign In</Text>
      <TextInput style={styles.input} placeholder="Username" onChangeText={setUsername} value={username} />
      <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry />
      {/* <Button title="Confirm" onPress={handleLogin} style = {styles.loginButton} /> */}
      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

function ToDoListScreen() {
  const [todosList1, setTodosList1] = useState([]);
  const [modalVisible1, setModalVisible1] = useState(false);

  const [todosList2, setTodosList2] = useState([]);
  const [modalVisible2, setModalVisible2] = useState(false);

  const [todosList3, setTodosList3] = useState([]);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [goals, setGoals] = useState([
    { id: 'goal1', name: 'Goal 1', isEditing: false },
    { id: 'goal2', name: 'Goal 2', isEditing: false },
    { id: 'goal3', name: 'Goal 3', isEditing: false },
  ]);
  const [editingGoal, setEditingGoal] = useState(null);

  useEffect(() => {
    // When the app loads, we fetch the stored to-do items
    const loadTodos = async () => {
      const storedTodosList1 = await getData('todosList1');
      if (storedTodosList1) {
        setTodosList1(storedTodosList1);
      }
    };

    loadTodos();
  }, []);
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('goals');
        if (jsonValue != null) {
          setGoals(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Error loading goals", e);
      }
    };
  
    loadGoals();
  }, []);
  

  const addTodo = (newTodo, setTodos) => {
    setTodos(prevTodos => {
      const updatedTodos = [...prevTodos, { key: Date.now().toString(), text: newTodo }];
      // Store the updated to-do list
      storeData(updatedTodos, 'todosList1');
      return updatedTodos;
    });
  };

  const storeData = async (value, key) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
      console.error("Error storing data", e);
    }
  };
  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
      console.error("Error retrieving data", e);
    }
  };
  const handleLongPress = (goalId) => {
    setEditingGoal(goalId);
  };

  const handleSaveGoalName = (newName) => {
    // setGoals((currentGoals) =>
    //   currentGoals.map((goal) =>
    //     goal.id === editingGoal ? { ...goal, name: newName, isEditing: false } : goal
    //   )
    // );
    // setEditingGoal(null);
    const updatedGoals = goals.map((goal) =>
    goal.id === editingGoal ? { ...goal, name: newName, isEditing: false } : goal
  );

  setGoals(updatedGoals);
  storeGoals(updatedGoals); // Save updated goals to AsyncStorage
  setEditingGoal(null);
  };
  const storeGoals = async (goals) => {
    try {
      const jsonValue = JSON.stringify(goals);
      await AsyncStorage.setItem('goals', jsonValue);
    } catch (e) {
      console.error("Error storing goals", e);
    }
  };
  const renderGoalHeader = (goal, setModalVisible) => {
    return (
      <TouchableOpacity onLongPress={() => handleLongPress(goal.id)} style={styles.goalContainer}>
        <FontAwesome5 name="fish" size={20} color="#FFF" solid />
        <Text style={styles.goalText}>{goal.name}</Text>
        <TouchableOpacity style={styles.plusButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  const renderTodoList = (todos, listNumber) => {
    let setModalVisible;
    if (listNumber === 1) setModalVisible = setModalVisible1;
    else if (listNumber === 2) setModalVisible = setModalVisible2;
    else if (listNumber === 3) setModalVisible = setModalVisible3;

    return (
      <View style={styles.goalContainer}>
        <FontAwesome5 name="fish" size={20} color="#FFF" solid />
        <Text style={styles.goalText}>{`Goal ${listNumber}`}</Text>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const GoalEditModal = ({ isVisible, onClose, initialGoalName }) => {
    const [goalName, setGoalName] = useState(initialGoalName);

    useEffect(() => {
      if (isVisible) {
        setGoalName(initialGoalName);
      }
    }, [isVisible, initialGoalName]);

    return (
      <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
        <View style={styles.modalView}>
          <TextInput style={styles.goalInput} onChangeText={setGoalName} value={goalName} autoFocus />
          <Button title="Done" onPress={() => handleSaveGoalName(goalName)} />
        </View>
      </Modal>
    );
  };
  const deleteTodoItem = (index, setTodos, listKey) => {
    setTodos((currentTodos) => {
      const updatedTodos = currentTodos.filter((_, i) => i !== index);
      storeData(updatedTodos, listKey);
      return updatedTodos;
    });
  };
  const renderInputItems = (todos, setTodos, listKey) => {
    return (
      <FlatList
        data={todos}
        renderItem={({ item, index }) => (
          <View style={styles.todoItemContainer}>
            <Text style={styles.todoItem}>{item.text}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTodoItem(index, setTodos, listKey)}
            >
              <Text style={styles.deleteButtonText}>x</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.key}
      />
    );
  };

  return (
    <View style={styles.todoContainer}>
      {/* {renderTodoList(todosList1, 1)}
      {renderInputItems(todosList1, setTodosList1, 'todosList1')}
      {renderTodoList(todosList1, 2)}
      {renderInputItems(todosList2, setTodosList2, 'todosList2')}
      {renderTodoList(todosList1, 3)}
      {renderInputItems(todosList3, setTodosList3, 'todosList3')} */}
       {goals.map((goal) =>
        goal.id === 'goal1' ? renderGoalHeader(goal, setModalVisible1) : null)}
      {renderInputItems(todosList1, setTodosList1, 'todosList1')}
      {goals.map((goal) =>
        goal.id === 'goal2' ? renderGoalHeader(goal, setModalVisible2) : null)}
      {renderInputItems(todosList2, setTodosList2, 'todosList2')}
      {goals.map((goal) =>
        goal.id === 'goal3' ? renderGoalHeader(goal, setModalVisible3) : null)}
      {renderInputItems(todosList3, setTodosList3, 'todosList3')}

      <TodoInputModal
        isVisible={modalVisible1}
        onDismiss={() => setModalVisible1(false)}
        onAdd={(newTodo) => addTodo(newTodo, setTodosList1)}
      />
      <TodoInputModal
        isVisible={modalVisible2}
        onDismiss={() => setModalVisible2(false)}
        onAdd={(newTodo) => addTodo(newTodo, setTodosList2)}
      />
      <TodoInputModal
        isVisible={modalVisible3}
        onDismiss={() => setModalVisible3(false)}
        onAdd={(newTodo) => addTodo(newTodo, setTodosList3)}
      />
      <GoalEditModal isVisible={editingGoal !== null} onClose={() => setEditingGoal(null)} initialGoalName={editingGoal ? goals.find(goal => goal.id === editingGoal).name : ''} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ToDoList" component={ToDoListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: '#21364d', // Example button background color
    padding: 8,
    textAlignVertical: 'center',
    // height: 35,
    width: '20%',
    borderRadius: 10,
    marginTop: 7, // Add margin if needed
    // ... other button styles
  },
  loginButtonText: {
    color: 'white', // Change text color here
    textAlign: 'center',
    fontSize: 14,
    // ... other text styles
  },
  iconStyle: {
    padding: 10,
    marginTop: -90,
    // marginBottom: 10, // Add some space below the icon
    // ... additional styling for your icon if needed
    // width: '80%',
    color: '#21364d',
  },
  todoItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // padding: 5,
    backgroundColor: '#fff', // Use your preferred color
    width: '92%',
    borderRadius: 10,
    marginVertical: 0,
    marginLeft: 20,
  },
  deleteButton: {
    // Style your delete button
    backgroundColor: 'red',
    // padding: 5,
    borderRadius: 5,
    height: 20,
    width: 20,
    alignItems: 'center'
  },
  deleteButtonText: {
    flexDirection: 'row',
    color: 'white',
    textAlign: 'center',
    // Add other styling for the delete button text as needed
  },
  goalContainer: {
    flexDirection: 'row', // Aligns items in a row
    alignItems: 'center', // Centers items vertically in the container
    justifyContent: 'space-between', // Puts space between the items
    backgroundColor: '#21364d',
    borderRadius: 40,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    height: 40,
  },
  goalText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10, 
    fontWeight: 'bold',// Optional: add space between the icon and the text
    // Add other styling for the goal text as needed
  },
  todoContainer: {
    backgroundColor: "#fff",
    // flexDirection: 'column',
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    alignItems: 'left',
    justifyContent: 'center',
    paddingTop: 50,
  },
  listSectionContainer: {
    backgroundColor: '#A9A9A9', // Dark gray color
    borderRadius: 40, // Border radius
    padding: 10,
    marginVertical: 5,
    // width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // marginBottom: 10, // Add space between buttons and the list
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
    borderRadius: 10,
    
  },
  todoItem: {
    padding: 10,
    fontSize: 16,
    // height: 44,
    color: '#000',
    
  },
  plusButton: {
    marginLeft: 10,
    backgroundColor: '#273E57',
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    
  shadowColor: "#fff",
  shadowOffset: {
    width: 0,
    height: 2, // Vertical offset of the shadow
  },
  shadowOpacity: 0.2, // Opacity of the shadow
  shadowRadius: 2, // Blur radius of the shadow
  elevation: 5, // For Android
  },
  buttonText: {
    color: '#fff', // White color text
    fontSize: 16, // Adjust your font size as needed
  },
  plusButtonText: {
    color: '#fff',
    fontSize: 15,
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  modalView: {
    // Styles for your modal view
    marginTop: '50%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});

