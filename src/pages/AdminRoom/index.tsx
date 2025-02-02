import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';


import { Button } from '../../components/Button';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';
import { useRoom } from '../../hooks/useRoom';

import { database } from '../../services/firebase';
import '../../styles/room.scss';
import { useState } from 'react';
import { Modal } from '../../components/Modal';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  //const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);

  const [isVisibleModal, setIsVisibleModal] = useState(false)
  const [idSelecionado, setIdSelecionado] = useState('')

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    setIsVisibleModal(true)
    setIdSelecionado(questionId)
  }

  async function handleConfirmRemove(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    
    setIsVisibleModal(false)
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })

  }

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true,
    })
  }

  return (
    <>
      <div className="page-room">
        <header>
          <div className="content">
            <img src={logoImg} alt="Letmeask" />
            <div>
              <RoomCode code={roomId} />
              <Button onClick={handleEndRoom} isOutlined>Encerrar sala</Button>
            </div>
          </div>
        </header>

        <main>
          <div className="room-title">
            <h1>Sala {title}</h1>
            {questions.length > 1 && <span>{questions.length} perguntas</span>}
            {questions.length === 1 && <span>{questions.length} pergunta</span>}
          </div>

          <div className="question-list">
            {questions.map(question => {
              return (
                <>
                  <Question
                    key={question.id}
                    content={question.content}
                    author={question.author}
                    isHighLighted={question.isHighLighted}
                    isAnswered={question.isAnswered}
                  >
                    {!question.isAnswered && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCheckQuestionAsAnswered(question.id)}
                        >
                          <img src={checkImg} alt="Marcar pergunta como respondida" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHighLightQuestion(question.id)}
                        >
                          <img src={answerImg} alt="Dar destque à pergunta" />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <img src={deleteImg} alt="Remover pergunta" />
                    </button>

                  </Question>
                  
                </>
              );
            })}
          </div>
        </main>
      </div>
      { 
        isVisibleModal && 
        <Modal 
          onClose={() => setIsVisibleModal(false)}
          confirm={() => handleConfirmRemove(idSelecionado)}
        >
          Deseja excluir a pergunta?
        </Modal> 
      }
    </>      
  );
}