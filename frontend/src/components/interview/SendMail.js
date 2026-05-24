import axios from 'axios';

const SendMail = async (candidate) => {

  try {

    const response = await axios.post(
      'http://localhost:5000/api/send',
      {
        name: candidate.name,
        email: candidate.email,
        time: candidate.date,
        interviewer: candidate.interviewer,
        interviewType: candidate.interviewType,
        roomId: candidate.roomId
      }
    );

    alert('Email Sent Successfully');

    return response.data;

  } catch (error) {

    console.log(error);

    alert('Failed To Send Email');
  }
};

export default SendMail;