import React, { useEffect, useState } from 'react';
import { ButtonStyle, StyledArrows, StyledCalendarMonth, StyledCurrentHead, StyledDay, StyledDayHeader, StyledDays, StyledDaysGrid, StyledEmptyDay, StyledHoliday, StyledTodo, StyledTodoList } from './Calendar.styled';
import BasicModal from '../Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { selectTodo } from '../../Redux/ToDo/selectors';
import { editTodoPosition, refreshTodo } from '../../Redux/ToDo/operations';
import { Dispatch } from '../../Redux/store';
import { nanoid } from 'nanoid'
import TodoModal from '../TodoModal/TodoModal';
import { GetPublicHolidays, fetchLocation } from '../../Redux/CountryAndHolidays/apiOperatins';
import { selectHoliday } from '../../Redux/CountryAndHolidays/selectors';
import Left from '../images/left.png';
import Right from '../images/right.png';


interface CalendarMonthProps {
  year: number;
  month: number;
}

export interface Todo {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  title: string;
  position: string;
  description: string;
  month:string;
  time: string;
  importance:string;
  _id?: string;
}

  const CalendarMonth: React.FC<CalendarMonthProps> = ({ year }) => {

 const dispatch = useDispatch() as Dispatch;
 const TODO: Todo[] = useSelector(selectTodo);
 const holidays = useSelector(selectHoliday)

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  const [country, setCountry] = useState('' || 'ua');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);

  const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const firstDayOfWeek = new Date(currentYear, selectedMonth - 1, 1).getDay();

  const sortedTODO = [...TODO].sort((a, b) => {
    const timeA = a?.time || ""; 
    const timeB = b?.time || ""; 
    return timeA.localeCompare(timeB);
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
  
        const response = await fetchLocation({ latitude, longitude });
        setCountry(response);
      } catch (error) {
        console.error(error);
      }
    }, (error) => {
      console.error(error.message);
    });
  } else {
    console.error('Geolocation failed');
  }
  
  const handleNextMonth = () => {
      setSelectedMonth((prevMonth) => (prevMonth === 12 ? 1 : prevMonth + 1));
  };
  
  const handlePrevMonth = () => {
      setSelectedMonth((prevMonth) => (prevMonth === 1 ? 12 : prevMonth - 1));
  };

  
 useEffect(() => {
  dispatch(refreshTodo());
  
}, [dispatch]);

useEffect(() => {
  dispatch(GetPublicHolidays({ year: currentYear.toString(), countryCode: country }));
  
}, [dispatch, currentYear, country]);

    const onDragStart = (event: React.DragEvent, todo: Todo) => {
      event.dataTransfer.setData('text/plain', ''); 
      setDraggedTodo(todo);
    };


    const onDragOver = (event: React.DragEvent) => {
      event.preventDefault();
    };
  
    const handleDrop = (event: React.DragEvent, day: number) => {
      event.preventDefault();
      if (draggedTodo) {
        const newPosition = `${day}`; 
         dispatch(
          editTodoPosition({
            ...draggedTodo,
            position: newPosition,
          })
        );
        setDraggedTodo(null);
      }
    }
  
    useEffect(() => {
      }, [selectedMonth]);
  
    return (
      <StyledCalendarMonth>
        <ButtonStyle>
        <StyledArrows src={Left} onClick={handlePrevMonth}></StyledArrows>
        <h2>{new Date(year, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {currentYear}</h2>
        <StyledArrows src={Right} onClick={handleNextMonth}></StyledArrows>
      </ButtonStyle>

     

        <StyledDays>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <StyledDayHeader key={day}>
              {day}
            </StyledDayHeader>
          ))}
        </StyledDays>
        <StyledDaysGrid>
          {Array.from({ length: firstDayOfWeek }, (_, i) => (
            <StyledEmptyDay key={`empty-${i}`} />
          ))}
{days.map((day) => {
  const formattedDay = day < 10 ? `0${day}` : `${day}`;
  const formattedMonth = selectedMonth < 10 ? `0${selectedMonth}` : `${selectedMonth}`;
  const formattedDate = `${currentYear}-${formattedMonth}-${formattedDay}`;

  const holiday = holidays.find((h) => {
    if (h.date === formattedDate) {
      return h;
    }
    return null;
  });
  console.log(holiday);

  return (
    <StyledDay
      key={day}
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => handleDrop(e, day)}
    >
      <div>
        {day === currentDay && currentMonth === selectedMonth ? (
          <StyledCurrentHead>{day}</StyledCurrentHead>
        ) : (
          <>
            <span>{day}</span>
            
          </>
        )}
        {holiday && <StyledHoliday>{holiday.localName}</StyledHoliday>}
        <StyledTodoList>
        {sortedTODO.map((todo: Todo) => {
  if (todo.position === day.toString() && todo.month === selectedMonth.toString()) {
    return (
      <StyledTodo
        key={nanoid()}
        draggable
        onDragStart={(e) => onDragStart(e, todo)}
        style={
          todo.importance === "High"
            ? { backgroundColor: "#bf1111" } 
            : todo.importance === "Medium"
            ? { backgroundColor: "#eb8034" } 
            : todo.importance === "Low"
            ? { backgroundColor: "green" } 
            : {} 
        }
      >
        <span>{todo.title}</span>
        <span>{todo.time}</span>
        <TodoModal todo={todo} />
      </StyledTodo>
    );
  }
  return null;
})}
        </StyledTodoList>
      </div>
      <BasicModal day={day.toString()} selectedMonth={selectedMonth.toString()} />
    </StyledDay>
  );
})}
        </StyledDaysGrid>
      </StyledCalendarMonth>
      
    );
  };
  
  export default CalendarMonth;