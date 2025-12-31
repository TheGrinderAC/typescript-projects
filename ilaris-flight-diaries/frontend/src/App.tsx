import { useState, useEffect } from 'react';
import { Weather, Visibility,type DiaryEntry,type NewDiaryEntry } from './types';
import { getAllDiaries, createDiary } from './services/diaries';
import axios from 'axios';
import './App.css';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newVisibility, setNewVisibility] = useState<Visibility>(Visibility.Great);
  const [newWeather, setNewWeather] = useState<Weather>(Weather.Sunny);
  const [newComment, setNewComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const newEntry: NewDiaryEntry = {
        date: newDate,
        visibility: newVisibility,
        weather: newWeather,
        comment: newComment,
      };
      const addedDiary = await createDiary(newEntry);
      setDiaries(diaries.concat(addedDiary));
      setNewDate('');
      setNewVisibility(Visibility.Great);
      setNewWeather(Weather.Sunny);
      setNewComment('');
      setErrorMessage('');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage('An unknown error occurred.');
        }
      } else {
        setErrorMessage('An unknown error occurred.');
      }
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <div>
      <h1>Ilaris Flight Diaries</h1>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <h2>Add new entry</h2>
      <form onSubmit={diaryCreation}>
        <div>
          date{' '}
          <input
            type="date"
            value={newDate}
            onChange={(event) => setNewDate(event.target.value)}
          />
        </div>
        <div>
          visibility{' '}
          {Object.values(Visibility).map((v) => (
            <label key={v}>
              <input
                type="radio"
                name="visibility"
                value={v}
                checked={newVisibility === v}
                onChange={() => setNewVisibility(v)}
              />
              {v}
            </label>
          ))}
        </div>
        <div>
          weather{' '}
          {Object.values(Weather).map((w) => (
            <label key={w}>
              <input
                type="radio"
                name="weather"
                value={w}
                checked={newWeather === w}
                onChange={() => setNewWeather(w)}
              />
              {w}
            </label>
          ))}
        </div>
        <div>
          comment{' '}
          <input
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>
      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>Visibility: {diary.visibility}</p>
          <p>Weather: {diary.weather}</p>
          <p>Comment: {diary.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default App;

