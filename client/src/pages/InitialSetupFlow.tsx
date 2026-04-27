import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  CheckCircleIcon,
  HomeIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface QuizQuestion {
  id: number;
  text: string;
  options: { text: string; value: number }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    text: 'How often do you want to vacuum or sweep floors?',
    options: [
      { text: 'Daily', value: 100 },
      { text: '2-3 times per week', value: 75 },
      { text: 'Once a week', value: 50 },
      { text: 'Every 2 weeks', value: 25 },
      { text: 'Monthly or less', value: 0 }
    ]
  },
  {
    id: 2,
    text: 'How often do you want to clean bathroom?',
    options: [
      { text: 'Daily', value: 100 },
      { text: '2-3 times per week', value: 75 },
      { text: 'Once a week', value: 50 },
      { text: 'Every 2 weeks', value: 25 },
      { text: 'Monthly', value: 0 }
    ]
  },
  {
    id: 3,
    text: 'How often do you want to wipe down kitchen counters/stove?',
    options: [
      { text: 'After every use', value: 100 },
      { text: 'Daily', value: 75 },
      { text: '2-3 times per week', value: 50 },
      { text: 'Once a week', value: 25 },
      { text: 'Monthly', value: 0 }
    ]
  },
  {
    id: 4,
    text: 'How often do you want to do dishes?',
    options: [
      { text: 'After every meal', value: 100 },
      { text: 'Daily', value: 75 },
      { text: 'Once a day', value: 50 },
      { text: 'Every 2 days', value: 25 },
      { text: 'Weekly', value: 0 }
    ]
  },
  {
    id: 5,
    text: 'How often do you want to take out trash/recycling?',
    options: [
      { text: 'Daily', value: 100 },
      { text: 'Every 2-3 days', value: 75 },
      { text: 'Weekly', value: 50 },
      { text: 'Every 2 weeks', value: 25 },
      { text: 'Monthly', value: 0 }
    ]
  },
  {
    id: 6,
    text: 'How quickly does clutter bother you?',
    options: [
      { text: 'Immediately - I clean it right away', value: 100 },
      { text: 'Within a few hours', value: 75 },
      { text: 'By the end of the day', value: 50 },
      { text: 'Within a day or two', value: 25 },
      { text: "It doesn't bother me much", value: 0 }
    ]
  },
  {
    id: 7,
    text: 'How often do you want to change bedding?',
    options: [
      { text: 'Weekly', value: 100 },
      { text: 'Every 2 weeks', value: 75 },
      { text: 'Monthly', value: 50 },
      { text: 'Every 6 weeks', value: 25 },
      { text: 'Every 3 months', value: 0 }
    ]
  },
  {
    id: 8,
    text: 'How often do you want to do laundry?',
    options: [
      { text: '2-3 times per week', value: 100 },
      { text: 'Weekly', value: 75 },
      { text: 'Every 2 weeks', value: 50 },
      { text: 'Monthly', value: 25 },
      { text: 'When I run out of clothes', value: 0 }
    ]
  }
];

const dwellingTypes = [
  { id: 1, name: 'Apartment', description: 'Multi-unit residential dwelling with shared walls' },
  { id: 2, name: 'House', description: 'Single-family residential dwelling' },
  { id: 3, name: 'Studio', description: 'Single-room living space with combined areas' }
];

const rooms = [
  { id: 1, name: 'Kitchen', icon: '🍳' },
  { id: 2, name: 'Bathroom', icon: '🚿' },
  { id: 3, name: 'Bedroom', icon: '🛏' },
  { id: 4, name: 'Living Room', icon: '🛋' },
  { id: 5, name: 'Laundry', icon: '🧺' }
];

const cleaningDays = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' }
];

export const InitialSetupFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [selectedDwelling, setSelectedDwelling] = useState<number | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const calculateScore = () => {
    const totalScore = Object.values(quizAnswers).reduce((sum, score) => sum + score, 0);
    return Math.round(totalScore / Object.keys(quizAnswers).length);
  };

  const getScoreCategory = (score: number) => {
    if (score >= 81) return { name: 'Spotless Specialist', description: 'You are a cleaning expert who maintains perfection', color: 'text-purple-600' };
    if (score >= 61) return { name: 'Neat Freak', description: 'You take pride in maintaining a spotless living space', color: 'text-blue-600' };
    if (score >= 41) return { name: 'Routine Ready', description: 'You have a solid cleaning routine and stick to it', color: 'text-green-600' };
    if (score >= 21) return { name: 'Casual Cleaner', description: 'You like to keep things tidy without being too strict', color: 'text-yellow-600' };
    return { name: 'Minimalist Maintainer', description: 'You prefer a clean but minimal approach to cleaning', color: 'text-gray-600' };
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeSetup = () => {
    // Mock completion - replace with actual API call
    navigate('/dashboard');
  };

  const toggleRoomSelection = (roomId: number) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter(id => id !== roomId));
    } else if (selectedRooms.length < 2) {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Cleanliness Quiz</h2>
            <p style={{ color: '#6b7280' }}>Answer 8 questions to determine your cleaning personality</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {quizQuestions.map((question, index) => (
                <div key={question.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '0.875rem', fontWeight: '500', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
                      Question {index + 1} of 8
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>{question.text}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {question.options.map((option, optIndex) => (
                      <label key={optIndex} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.value}
                          checked={quizAnswers[question.id] === option.value}
                          onChange={(e) => setQuizAnswers({ ...quizAnswers, [question.id]: parseInt(e.target.value) })}
                          style={{ marginRight: '0.75rem', color: '#2563eb', cursor: 'pointer' }}
                        />
                        <span style={{ color: '#374151' }}>{option.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            </div>
        );

      case 2:
        const score = calculateScore();
        const category = getScoreCategory(score);
        return (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
              <div style={{ width: '8rem', height: '8rem', margin: '0 auto 1.5rem', background: 'linear-gradient(to bottom right, #2563eb, #9333ea)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '2.25rem', fontWeight: 'bold' }}>{score}</span>
              </div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Your Neat Freak Score</h2>
              <p style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '1rem', color: category.color === 'text-purple-600' ? '#9333ea' : category.color === 'text-blue-600' ? '#2563eb' : category.color === 'text-green-600' ? '#16a34a' : category.color === 'text-yellow-600' ? '#ca8a04' : '#4b5563' }}>{category.name}</p>
              <p style={{ color: '#6b7280', maxWidth: '28rem', margin: '0 auto' }}>{category.description}</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Select Your Dwelling Type</h2>
            <p style={{ color: '#6b7280' }}>Choose the type of home you live in</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }}>
              {dwellingTypes.map(type => (
                <label
                  key={type.id}
                  style={{
                    position: 'relative',
                    padding: '1.5rem',
                    border: '2px solid',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    borderColor: selectedDwelling === type.id ? '#2563eb' : '#e5e7eb',
                    backgroundColor: selectedDwelling === type.id ? '#eff6ff' : 'white'
                  }}
                  onMouseOver={(e) => { if (selectedDwelling !== type.id) { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; } }}
                  onMouseOut={(e) => { if (selectedDwelling !== type.id) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = 'white'; } }}
                >
                  <input
                    type="radio"
                    name="dwelling"
                    value={type.id}
                    checked={selectedDwelling === type.id}
                    onChange={(e) => setSelectedDwelling(parseInt(e.target.value))}
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                  />
                  <div style={{ textAlign: 'center' }}>
                    <HomeIcon style={{ height: '3rem', width: '3rem', color: '#9ca3af', margin: '0 auto 0.75rem' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>{type.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Select Priority Rooms</h2>
            <p style={{ color: '#6b7280' }}>Choose your top 2 priority rooms (ranked 1 and 2)</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }}>
              {rooms.map(room => (
                <label
                  key={room.id}
                  style={{
                    position: 'relative',
                    padding: '1.5rem',
                    border: '2px solid',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    borderColor: selectedRooms.includes(room.id) ? '#2563eb' : '#e5e7eb',
                    backgroundColor: selectedRooms.includes(room.id) ? '#eff6ff' : 'white'
                  }}
                  onMouseOver={(e) => { if (!selectedRooms.includes(room.id)) { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; } }}
                  onMouseOut={(e) => { if (!selectedRooms.includes(room.id)) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = 'white'; } }}
                >
                  <input
                    type="checkbox"
                    checked={selectedRooms.includes(room.id)}
                    onChange={() => toggleRoomSelection(room.id)}
                    disabled={!selectedRooms.includes(room.id) && selectedRooms.length >= 2}
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                  />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{room.icon}</div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>{room.name}</h3>
                    {selectedRooms.includes(room.id) && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#dbeafe', color: '#1e40af' }}>
                          Priority {selectedRooms.indexOf(room.id) + 1}
                        </span>
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>
              {selectedRooms.length}/2 rooms selected
            </p>
          </div>
        );

      case 5:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Select Your Cleaning Day</h2>
            <p style={{ color: '#6b7280' }}>Choose your preferred day for weekly cleaning</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {cleaningDays.map(day => (
                <label
                  key={day.id}
                  style={{
                    position: 'relative',
                    padding: '1rem',
                    border: '2px solid',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    borderColor: selectedDay === day.id ? '#2563eb' : '#e5e7eb',
                    backgroundColor: selectedDay === day.id ? '#eff6ff' : 'white'
                  }}
                  onMouseOver={(e) => { if (selectedDay !== day.id) { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; } }}
                  onMouseOut={(e) => { if (selectedDay !== day.id) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = 'white'; } }}
                >
                  <input
                    type="radio"
                    name="cleaningDay"
                    value={day.id}
                    checked={selectedDay === day.id}
                    onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                  />
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{day.name}</div>
                </label>
              ))}
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Cleaning Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Notification Setup</h2>
            <p style={{ color: '#6b7280' }}>Configure your cleaning reminders</p>
            
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BellIcon style={{ height: '1.5rem', width: '1.5rem', color: '#9ca3af', marginRight: '0.75rem' }} />
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>Push Notifications</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Get reminders for your cleaning tasks</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    height: '1.5rem',
                    width: '2.75rem',
                    flexShrink: 0,
                    cursor: 'pointer',
                    borderRadius: '9999px',
                    border: '2px solid transparent',
                    backgroundColor: notificationsEnabled ? '#2563eb' : '#d1d5db',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <span
                    style={{
                      transform: notificationsEnabled ? 'translateX(1.25rem)' : 'translateX(0)',
                      display: 'inline-block',
                      height: '1.25rem',
                      width: '1.25rem',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </button>
              </div>
              
              {notificationsEnabled && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                    You'll receive reminders on {cleaningDays.find(d => d.id === selectedDay)?.name} at {selectedTime}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / 6) * 100;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <React.Fragment key={step}>
                  <div
                    style={{
                      height: '0.5rem',
                      width: '2rem',
                      borderRadius: '9999px',
                      backgroundColor: step <= currentStep ? '#2563eb' : '#d1d5db'
                    }}
                  />
                  {step < 6 && (
                    <div
                      style={{
                        height: '0.25rem',
                        width: '2rem',
                        backgroundColor: step < currentStep ? '#2563eb' : '#d1d5db'
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
            Step {currentStep} of 6: {progressPercentage.toFixed(0)}% Complete
          </p>
        </div>

        {/* Step Content */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              backgroundColor: 'white',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 1 ? 0.5 : 1
            }}
            onMouseOver={(e) => { if (currentStep !== 1) e.currentTarget.style.backgroundColor = '#f9fafb' }}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <ChevronLeftIcon style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
            Previous
          </button>

          {currentStep === 6 ? (
            <button
              onClick={completeSetup}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#16a34a',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
            >
              <CheckCircleIcon style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
              Complete Setup
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && Object.keys(quizAnswers).length < 8) ||
                (currentStep === 3 && !selectedDwelling) ||
                (currentStep === 4 && selectedRooms.length !== 2) ||
                (currentStep === 5 && selectedDay === null)
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#2563eb',
                cursor: 'pointer',
                opacity: (
                  (currentStep === 1 && Object.keys(quizAnswers).length < 8) ||
                  (currentStep === 3 && !selectedDwelling) ||
                  (currentStep === 4 && selectedRooms.length !== 2) ||
                  (currentStep === 5 && selectedDay === null)
                ) ? 0.5 : 1
              }}
              onMouseOver={(e) => {
                if (!((currentStep === 1 && Object.keys(quizAnswers).length < 8) ||
                  (currentStep === 3 && !selectedDwelling) ||
                  (currentStep === 4 && selectedRooms.length !== 2) ||
                  (currentStep === 5 && selectedDay === null))) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }
              }}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              Next
              <ChevronRightIcon style={{ height: '1rem', width: '1rem', marginLeft: '0.5rem' }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
