import React, { useEffect, useMemo, useState } from 'react';

import { Data } from './data';
import { shuffle } from './utils';
import './App.css';

function App() {
  const [list, setList] = useState([]);
  const [answered, setAnswered] = useState([]);
  const [finish, setFinish] = useState(false);
  const [anim, setAnim] = useState(false);
  const [notFinished, setNotFinished] = useState(false);

  useEffect(() => {
    const shuffled = Data.map(item =>
      Object.assign({}, { ...item, answers: shuffle(item.answers) })
    );
    setList(shuffle(shuffled));

    return () => {
      setList([]);
      setAnswered([]);
      setFinish(false);
      setNotFinished(false);
    };
  }, []);

  const handleAnswers = (id, elem) => {
    const filtered = list.map(item =>
      item.id === id
        ? { ...item, correct: elem.correct ? `${id}` : 'not' }
        : item
    );
    setList(filtered);

    setAnswered([...answered, { correct: elem.correct ? `${id}` : '' }]);
  };

  const handleSubmit = () => {
    if (answered.length === list.length) {
      setFinish(true);
      setNotFinished(false);
    } else {
      setNotFinished(true);
    }
  };

  const lengthCorrectAnswer = useMemo(
    () => answered.filter(item => item.correct).length,
    [answered]
  );

  return (
    <div className="App">
      <div className="App__inner">
        <div className="App__wrap">
          <h2>Определение знаний студентов по дисцеплине "Философия"</h2>
          <h3>
            По окончании теста вы увидите правильные ответы. Прочитайте
            внимательно вопрос и выберите один из предложенных вариантов
            ответов.
          </h3>
        </div>
        {list.map((item, index) => (
          <div
            key={item.id}
            className={
              item.correct === String(item.id)
                ? 'App__wrap green'
                : item.correct === 'not'
                ? 'App__wrap red'
                : 'App__wrap'
            }
          >
            <div className="App__top">
              <p className="App__quest">{item.name}</p>
            </div>
            <div className="App__bottom">
              {item.answers.map((elem, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswers(item.id, elem)}
                  className={
                    item.correct === String(item.id) && elem.correct
                      ? 'checkedAnswer green'
                      : item.correct === 'not' && elem.correct === false
                      ? 'checkedAnswer '
                      : 'checkedAnswer'
                  }
                >
                  {elem.answer}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="App__wrap submit">
          <button className="button" onClick={handleSubmit}>
            Отправить
          </button>
          {finish && (
            <div
              className={`loader ${finish && 'active'}`}
              onAnimationEnd={() => setAnim(true)}
            >
              <div className={`check ${anim && 'active'}`}>
                <span className="check-one"></span>
                <span className="check-two"></span>
              </div>
            </div>
          )}
        </div>
        {notFinished && (
          <div className="notFinished">Вы не ответили на все вопросы!</div>
        )}
        {finish && answered.length === list.length && (
          <div className="App__wrap answered">
            {lengthCorrectAnswer >= 8
              ? 'Отлично'
              : lengthCorrectAnswer > 5
              ? 'Хорошо'
              : 'Очень плохо'}
            {': '}
            {lengthCorrectAnswer + ' из ' + answered.length}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
