// JAMB Physics Past Questions
// Questions are displayed as images showing question text and diagrams (no options)
// Students read from the image and select their answer

window.jambQuestions = window.jambQuestions || {};

// Answer keys for all years (A=0, B=1, C=2, D=3)
const answerToIndex = (letter) => {
  if (!letter || letter === 'NO') return 0;
  return letter.charCodeAt(0) - 65;
};

// Answer keys
const answers = {
  '2010': {1:'B',2:'D',3:'D',4:'A',5:'D',6:'C',7:'C',8:'B',9:'A',10:'C',11:'D',12:'D',13:'D',14:'A',15:'D',16:'C',17:'A',18:'C',19:'B',20:'A',21:'D',22:'C',23:'A',24:'B',25:'D',26:'B',27:'D',28:'D',29:'D',30:'A',31:'A',32:'A',33:'C',34:'C',35:'B',36:'C',37:'A',38:'A',39:'B',40:'C',41:'A',42:'A',43:'A',44:'A',45:'B',46:'A',47:'NO',48:'C',49:'C',50:'A'},
  '2011': {1:'C',2:'A',3:'B',4:'A',5:'D',6:'A',7:'A',8:'C',9:'A',10:'A',11:'C',12:'D',13:'D',14:'A',15:'A',16:'C',17:'D',18:'B',19:'B',20:'D',21:'C',22:'D',23:'NO',24:'B',25:'D',26:'C',27:'C',28:'B',29:'A',30:'C',31:'B',32:'C',33:'A',34:'D',35:'NO',36:'B',37:'D',38:'A',39:'NO',40:'A',41:'A',42:'A',43:'C',44:'A',45:'A',46:'D',47:'B',48:'C',49:'D',50:'B'},
  '2012': {1:'B',2:'C',3:'D',4:'C',5:'D',6:'B',7:'A',8:'A',9:'A',10:'C',11:'B',12:'B',13:'D',14:'C',15:'B',16:'B',17:'A',18:'C',19:'D',20:'A',21:'C',22:'C',23:'A',24:'B',25:'D',26:'C',27:'A',28:'C',29:'D',30:'C',31:'D',32:'B',33:'B',34:'A',35:'C',36:'C',37:'A',38:'A',39:'A',40:'C',41:'A',42:'B',43:'A',44:'A',45:'A',46:'B',47:'A',48:'C',49:'C',50:'A'},
  '2013': {1:'B',2:'C',3:'D',4:'C',5:'D',6:'B',7:'A',8:'A',9:'A',10:'C',11:'B',12:'B',13:'D',14:'C',15:'B',16:'B',17:'A',18:'C',19:'D',20:'A',21:'C',22:'C',23:'A',24:'B',25:'D',26:'C',27:'A',28:'C',29:'D',30:'C',31:'D',32:'B',33:'B',34:'A',35:'C',36:'C',37:'A',38:'A',39:'A',40:'C',41:'A',42:'B',43:'A',44:'A',45:'A',46:'B',47:'A',48:'C',49:'C',50:'A'},
  '2014': {1:'A',2:'A',3:'C',4:'A',5:'C',6:'B',7:'D',8:'C',9:'C',10:'C',11:'D',12:'C',13:'A',14:'C',15:'C',16:'D',17:'D',18:'D',19:'C',20:'A',21:'C',22:'A',23:'B',24:'B',25:'C',26:'C',27:'B',28:'A',29:'A',30:'A',31:'A',32:'B',33:'A',34:'D',35:'D',36:'C',37:'C',38:'A',39:'B',40:'C',41:'B',42:'A',43:'A',44:'D',45:'C',46:'C',47:'C',48:'D',49:'A',50:'C'},
  '2015': {1:'A',2:'C',3:'B',4:'D',5:'A',6:'B',7:'C',8:'D',9:'A',10:'B',11:'C',12:'D',13:'A',14:'B',15:'C',16:'D',17:'A',18:'B',19:'C',20:'D',21:'A',22:'B',23:'C',24:'D',25:'A',26:'B',27:'C',28:'D',29:'A',30:'D',31:'A',32:'B',33:'D',34:'A',35:'D',36:'A',37:'B',38:'A',39:'B',40:'C'},
  '2016': {1:'B',2:'C',3:'A',4:'C',5:'A',6:'B',7:'C',8:'D',9:'A',10:'B',11:'C',12:'D',13:'D',14:'B',15:'A',16:'B',17:'C',18:'D',19:'A',20:'C',21:'A',22:'C',23:'B',24:'D',25:'A',26:'B',27:'C',28:'D',29:'B',30:'C',31:'A',32:'D',33:'B',34:'C',35:'A',36:'B',37:'C',38:'A',39:'D',40:'C'},
  '2017': {1:'A',2:'B',3:'D',4:'D',5:'A',6:'B',7:'C',8:'D',9:'A',10:'C',11:'B',12:'D',13:'A',14:'C',15:'B',16:'A',17:'D',18:'C',19:'B',20:'A',21:'C',22:'A',23:'B',24:'C',25:'D',26:'A',27:'B',28:'C',29:'D',30:'A',31:'B',32:'D',33:'C',34:'A',35:'B',36:'C',37:'D',38:'D',39:'A',40:'D'},
  '2018': {1:'A',2:'B',3:'D',4:'C',5:'D',6:'A',7:'B',8:'D',9:'C',10:'B',11:'A',12:'C',13:'B',14:'D',15:'A',16:'C',17:'D',18:'A',19:'B',20:'D',21:'C',22:'A',23:'B',24:'C',25:'D',26:'A',27:'B',28:'C',29:'D',30:'A',31:'B',32:'D',33:'C',34:'A',35:'B',36:'C',37:'D',38:'D',39:'A',40:'D'},
};

// Question data with images
// Images show question text + diagrams (no options)
const questionsData = {
  '2010': [
    {
      id: 'phy_2010_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][1]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q1.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][2]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q2.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][3]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q3.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][4]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q4.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][5]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q5.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][6]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q6.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][7]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q7.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][8]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q8.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][9]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q9.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][10]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q10.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][11]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q11.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][12]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q12.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][13]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q13.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][14]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q14.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][15]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q15.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][16]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q16.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][17]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q17.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][18]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q18.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][19]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q19.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][20]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q20.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][21]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q21.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][22]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q22.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][23]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q23.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][24]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q24.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][25]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q25.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][26]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q26.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][27]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q27.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][28]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q28.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][29]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q29.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][30]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q30.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][31]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q31.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][32]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q32.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][33]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q33.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][34]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q34.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][35]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q35.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][36]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q36.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][37]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q37.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][38]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q38.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][39]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q39.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][40]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q40.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_41',
      question: 'Question 41',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][41]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q41.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_42',
      question: 'Question 42',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][42]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q42.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_43',
      question: 'Question 43',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][43]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q43.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_44',
      question: 'Question 44',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][44]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q44.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_45',
      question: 'Question 45',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][45]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q45.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_46',
      question: 'Question 46',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][46]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q46.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_47',
      question: 'Question 47',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][47]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q47.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_48',
      question: 'Question 48',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][48]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q48.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_49',
      question: 'Question 49',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][49]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q49.png',
      hasDiagram: false
    },
    {
      id: 'phy_2010_50',
      question: 'Question 50',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2010'][50]),
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q50.png',
      hasDiagram: false
    },
  ],
  '2011': [
    {
      id: 'phy_2011_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][1]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q1.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][2]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q2.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][3]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q3.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][4]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q4.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][5]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q5.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][6]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q6.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][7]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q7.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][8]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q8.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][9]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q9.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][10]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q10.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][11]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q11.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][12]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q12.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][13]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q13.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][14]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q14.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][15]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q15.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][16]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q16.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][17]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q17.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][18]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q18.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][19]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q19.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][20]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q20.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][21]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q21.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][22]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q22.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][23]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q23.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][24]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q24.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][25]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q25.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][26]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q26.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][27]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q27.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][28]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q28.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][29]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q29.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][30]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q30.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][31]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q31.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][32]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q32.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][33]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q33.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][34]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q34.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][35]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q35.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][36]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q36.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][37]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q37.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][38]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q38.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][39]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q39.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][40]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q40.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_41',
      question: 'Question 41',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][41]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q41.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_42',
      question: 'Question 42',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][42]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q42.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_43',
      question: 'Question 43',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][43]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q43.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_44',
      question: 'Question 44',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][44]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q44.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_45',
      question: 'Question 45',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][45]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q45.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_46',
      question: 'Question 46',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][46]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q46.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_47',
      question: 'Question 47',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][47]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q47.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_48',
      question: 'Question 48',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][48]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q48.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_49',
      question: 'Question 49',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][49]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q49.png',
      hasDiagram: false
    },
    {
      id: 'phy_2011_50',
      question: 'Question 50',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2011'][50]),
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q50.png',
      hasDiagram: false
    },
  ],
  '2012': [
    {
      id: 'phy_2012_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][1]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q1.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][2]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q2.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][3]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q3.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][4]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q4.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][5]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q5.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][6]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q6.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][7]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q7.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][8]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q8.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][9]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q9.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][10]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q10.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][11]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q11.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][12]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q12.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][13]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q13.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][14]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q14.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][15]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q15.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][16]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q16.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][17]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q17.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][18]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q18.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][19]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q19.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][20]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q20.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][21]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q21.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][22]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q22.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][23]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q23.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][24]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q24.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][25]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q25.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][26]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q26.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][27]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q27.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][28]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q28.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][29]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q29.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][30]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q30.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][31]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q31.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][32]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q32.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][33]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q33.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][34]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q34.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][35]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q35.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][36]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q36.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][37]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q37.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][38]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q38.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][39]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q39.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][40]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q40.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_41',
      question: 'Question 41',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][41]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q41.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_42',
      question: 'Question 42',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][42]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q42.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_43',
      question: 'Question 43',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][43]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q43.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_44',
      question: 'Question 44',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][44]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q44.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_45',
      question: 'Question 45',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][45]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q45.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_46',
      question: 'Question 46',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][46]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q46.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_47',
      question: 'Question 47',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][47]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q47.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_48',
      question: 'Question 48',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][48]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q48.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_49',
      question: 'Question 49',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][49]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q49.png',
      hasDiagram: false
    },
    {
      id: 'phy_2012_50',
      question: 'Question 50',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2012'][50]),
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q50.png',
      hasDiagram: false
    },
  ],
  '2013': [
    {
      id: 'phy_2013_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][1]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q1.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][2]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q2.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][3]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q3.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][4]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q4.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][5]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q5.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][6]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q6.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][7]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q7.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][8]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q8.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][9]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q9.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][10]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q10.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][11]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q11.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][12]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q12.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][13]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q13.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][14]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q14.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][15]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q15.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][16]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q16.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][17]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q17.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][18]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q18.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][19]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q19.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][20]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q20.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][21]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q21.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][22]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q22.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][23]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q23.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][24]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q24.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][25]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q25.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][26]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q26.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][27]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q27.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][28]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q28.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][29]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q29.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][30]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q30.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][31]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q31.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][32]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q32.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][33]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q33.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][34]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q34.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][35]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q35.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][36]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q36.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][37]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q37.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][38]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q38.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][39]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q39.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][40]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q40.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_41',
      question: 'Question 41',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][41]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q41.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_42',
      question: 'Question 42',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][42]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q42.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_43',
      question: 'Question 43',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][43]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q43.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_44',
      question: 'Question 44',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][44]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q44.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_45',
      question: 'Question 45',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][45]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q45.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_46',
      question: 'Question 46',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][46]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q46.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_47',
      question: 'Question 47',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][47]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q47.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_48',
      question: 'Question 48',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][48]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q48.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_49',
      question: 'Question 49',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][49]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q49.png',
      hasDiagram: false
    },
    {
      id: 'phy_2013_50',
      question: 'Question 50',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2013'][50]),
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q50.png',
      hasDiagram: false
    },
  ],
  '2014': [
    {
      id: 'phy_2014_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][1]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q1.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][2]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q2.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][3]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q3.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][4]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q4.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][5]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q5.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][6]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q6.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][7]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q7.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][8]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q8.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][9]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q9.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][10]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q10.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][11]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q11.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][12]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q12.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][13]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q13.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][14]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q14.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][15]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q15.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][16]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q16.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][17]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q17.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][18]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q18.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][19]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q19.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][20]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q20.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][21]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q21.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][22]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q22.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][23]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q23.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][24]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q24.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][25]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q25.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][26]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q26.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][27]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q27.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][28]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q28.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][29]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q29.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][30]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q30.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][31]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q31.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][32]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q32.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][33]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q33.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][34]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q34.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][35]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q35.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][36]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q36.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][37]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q37.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][38]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q38.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][39]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q39.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][40]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q40.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_41',
      question: 'Question 41',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][41]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q41.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_42',
      question: 'Question 42',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][42]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q42.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_43',
      question: 'Question 43',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][43]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q43.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_44',
      question: 'Question 44',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][44]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q44.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_45',
      question: 'Question 45',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][45]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q45.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_46',
      question: 'Question 46',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][46]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q46.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_47',
      question: 'Question 47',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][47]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q47.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_48',
      question: 'Question 48',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][48]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q48.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_49',
      question: 'Question 49',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][49]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q49.png',
      hasDiagram: false
    },
    {
      id: 'phy_2014_50',
      question: 'Question 50',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2014'][50]),
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q50.png',
      hasDiagram: false
    },
  ],
  '2015': [
    {
      id: 'phy_2015_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][1]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q1.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][2]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q2.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][3]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q3.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][4]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q4.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][5]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q5.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][6]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q6.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][7]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q7.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][8]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q8.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][9]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q9.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][10]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q10.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][11]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q11.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][12]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q12.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][13]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q13.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][14]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q14.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][15]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q15.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][16]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q16.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][17]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q17.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][18]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q18.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][19]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q19.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][20]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q20.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][21]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q21.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][22]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q22.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][23]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q23.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][24]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q24.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][25]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q25.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][26]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q26.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][27]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q27.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][28]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q28.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][29]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q29.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][30]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q30.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][31]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q31.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][32]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q32.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][33]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q33.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][34]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q34.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][35]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q35.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][36]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q36.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][37]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q37.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][38]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q38.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][39]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q39.png',
      hasDiagram: false
    },
    {
      id: 'phy_2015_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2015'][40]),
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q40.png',
      hasDiagram: false
    },
  ],
  '2016': [
    {
      id: 'phy_2016_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][1]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q1.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][2]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q2.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][3]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q3.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][4]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q4.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][5]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q5.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][6]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q6.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][7]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q7.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][8]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q8.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][9]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q9.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][10]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q10.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][11]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q11.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][12]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q12.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][13]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q13.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][14]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q14.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][15]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q15.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][16]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q16.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][17]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q17.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][18]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q18.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][19]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q19.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][20]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q20.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][21]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q21.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][22]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q22.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][23]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q23.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][24]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q24.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][25]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q25.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][26]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q26.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][27]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q27.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][28]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q28.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][29]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q29.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][30]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q30.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][31]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q31.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][32]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q32.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][33]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q33.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][34]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q34.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][35]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q35.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][36]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q36.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][37]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q37.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][38]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q38.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][39]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q39.png',
      hasDiagram: false
    },
    {
      id: 'phy_2016_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2016'][40]),
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q40.png',
      hasDiagram: false
    },
  ],
  '2017': [
    {
      id: 'phy_2017_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][1]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q1.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][2]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q2.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][3]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q3.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][4]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q4.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][5]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q5.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][6]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q6.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][7]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q7.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][8]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q8.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][9]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q9.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][10]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q10.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][11]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q11.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][12]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q12.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][13]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q13.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][14]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q14.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][15]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q15.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][16]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q16.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][17]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q17.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][18]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q18.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][19]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q19.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][20]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q20.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][21]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q21.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][22]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q22.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][23]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q23.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][24]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q24.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][25]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q25.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][26]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q26.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][27]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q27.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][28]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q28.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][29]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q29.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][30]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q30.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][31]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q31.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][32]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q32.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][33]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q33.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][34]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q34.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][35]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q35.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][36]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q36.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][37]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q37.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][38]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q38.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][39]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q39.png',
      hasDiagram: false
    },
    {
      id: 'phy_2017_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2017'][40]),
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q40.png',
      hasDiagram: false
    },
  ],
  '2018': [
    {
      id: 'phy_2018_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][1]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q1.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][2]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q2.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][3]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q3.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][4]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q4.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][5]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q5.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][6]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q6.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][7]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q7.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][8]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q8.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][9]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q9.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][10]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q10.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][11]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q11.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][12]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q12.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][13]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q13.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][14]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q14.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][15]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q15.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][16]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q16.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][17]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q17.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][18]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q18.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][19]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q19.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][20]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q20.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][21]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q21.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][22]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q22.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][23]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q23.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][24]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q24.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][25]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q25.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][26]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q26.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][27]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q27.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][28]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q28.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][29]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q29.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][30]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q30.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][31]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q31.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][32]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q32.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][33]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q33.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][34]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q34.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][35]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q35.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][36]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q36.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][37]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q37.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][38]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q38.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][39]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q39.png',
      hasDiagram: false
    },
    {
      id: 'phy_2018_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: answerToIndex(answers['2018'][40]),
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q40.png',
      hasDiagram: false
    },
  ],
};

// Build complete questions object
jambQuestions["Physics"] = {
  years: Object.keys(questionsData),
  questionsByYear: questionsData
};

console.log('Physics questions loaded:', Object.keys(questionsData).reduce((sum, year) => 
  sum + questionsData[year].length, 0), 'questions with images');
