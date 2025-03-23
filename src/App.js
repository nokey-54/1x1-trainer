import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import html2canvas from 'html2canvas';
import './App.css';

// Animations
const sparkleAnimation = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1) rotate(180deg);
    opacity: 0.7;
  }
  100% {
    transform: scale(0) rotate(360deg);
    opacity: 0;
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
`;

const confettiFall = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(600px) rotate(720deg);
    opacity: 0;
  }
`;

const shine = keyframes`
  0% {
    background-position: -100px;
  }
  100% {
    background-position: 200px;
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-30px);}
  60% {transform: translateY(-15px);}
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Base mobile-first styles
const AppContainer = styled.div`
  background: linear-gradient(135deg, #fff0f5 0%, #ffb6c1 100%);
  min-height: 100vh;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding: 10px;
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(219, 112, 147, 0.3);
  padding: 15px;
  width: 100%;
  max-width: 450px;
  max-height: 95vh;
  text-align: center;
  background-image: linear-gradient(to bottom, #fff, #fff8f8);
  border: 3px solid #ffd1dc;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    padding: 25px;
    max-width: 500px;
    border-radius: 20px;
  }
`;

const Sparkle = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: #ffcce5;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: ${sparkleAnimation} 3s linear infinite;
  opacity: 0.7;
  z-index: 0;
  
  @media (min-width: 768px) {
    width: 10px;
    height: 10px;
  }
  
  &:nth-child(1) {
    top: 12%;
    left: 8%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    top: 20%;
    right: 12%;
    animation-delay: 0.4s;
  }
  
  &:nth-child(3) {
    bottom: 22%;
    left: 15%;
    animation-delay: 1.1s;
  }
  
  &:nth-child(4) {
    bottom: 12%;
    right: 8%;
    animation-delay: 1.7s;
  }
`;

const Title = styled.h1`
  color: #db7093;
  font-size: 1.7rem;
  margin: 0 0 10px 0;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  
  @media (min-width: 768px) {
    font-size: 2.3rem;
    margin-bottom: 15px;
  }
`;

const QuestionBox = styled.div`
  background-color: #fff0f5;
  border-radius: 15px;
  padding: 12px 10px;
  margin-bottom: 12px;
  font-size: 2rem;
  font-weight: 600;
  color: #db7093;
  box-shadow: 0 5px 15px rgba(219, 112, 147, 0.2);
  border: 2px dashed #ffb6c1;
  position: relative;
  z-index: 1;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 768px) {
    padding: 20px;
    margin-bottom: 20px;
    font-size: 2.5rem;
    min-height: 80px;
  }
  
  &::before, &::after {
    content: "✨";
    position: absolute;
    font-size: 1rem;
    
    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  &::before {
    top: 5px;
    left: 5px;
    
    @media (min-width: 768px) {
      top: 10px;
      left: 15px;
    }
  }
  
  &::after {
    bottom: 5px;
    right: 5px;
    
    @media (min-width: 768px) {
      bottom: 10px;
      right: 15px;
    }
  }
`;

const SpecialQuestionIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 215, 0, 0.4);
  color: #8B4513;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 0;
  text-transform: uppercase;
  
  @media (min-width: 768px) {
    font-size: 0.8rem;
    padding: 3px 0;
  }
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  
  @media (min-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 3px solid #ffb6c1;
  border-radius: 15px;
  font-size: 1.3rem;
  transition: all 0.3s;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  color: #db7093;
  font-weight: 600;
  background-color: #fff0f5;
  position: relative;
  z-index: 1;
  padding-right: ${props => props.showEnterButton ? '42px' : '10px'};
  height: 48px;
  
  &:focus {
    border-color: #ff69b4;
    outline: none;
    box-shadow: 0 0 15px rgba(255, 105, 180, 0.3);
  }
  
  @media (min-width: 768px) {
    padding: 15px;
    font-size: 1.5rem;
    padding-right: ${props => props.showEnterButton ? '50px' : '15px'};
    height: auto;
  }
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
  
  &::placeholder {
    color: #ffb6c1;
    opacity: 0.7;
  }
`;

const EnterButton = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(to right, #ff69b4, #db7093);
  color: white;
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const EnterIcon = styled.span`
  font-size: 1.1rem;
  font-weight: bold;
  transform: rotate(90deg);
  
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row; /* Horizontal on mobile */
  gap: 8px;
  width: 100%;
  position: relative;
  z-index: 1;
  margin-bottom: 8px;
  
  @media (min-width: 768px) {
    flex-direction: column;
    gap: 15px;
    margin-bottom: 15px;
  }
`;

const Button = styled.button`
  background: ${props => props.primary ? 
    'linear-gradient(to right, #ff69b4, #db7093)' : 
    'linear-gradient(to right, #a9a9a9, #808080)'};
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 42px;
  
  @media (min-width: 768px) {
    padding: 16px 20px;
    font-size: 1.3rem;
    height: auto;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Footer = styled.div`
  margin-top: 5px;
  font-size: 0.85rem;
  color: #db7093;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
  position: relative;
  z-index: 1;
  
  @media (min-width: 768px) {
    margin-top: 20px;
    font-size: 1rem;
    gap: 8px;
  }
`;

const HeartIcon = styled.span`
  color: #ff69b4;
  font-size: 1.1rem;
  animation: ${pulse} 1.5s infinite;
  margin: 0 3px;
  
  @media (min-width: 768px) {
    font-size: 1.4rem;
    margin: 0 5px;
  }
`;

const ProgressContainer = styled.div`
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
  
  @media (min-width: 768px) {
    margin-bottom: 20px;
  }
`;

const ProgressBar = styled.div`
  height: 10px;
  background-color: #f8f9fa;
  border-radius: 10px;
  margin: 5px 0;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    height: 15px;
    margin: 10px 0;
  }
  
  &::before {
    content: '';
    display: block;
    height: 100%;
    width: ${props => Math.min(props.progress, 100)}%;
    background: ${props => {
      if (props.progress >= 80) return 'linear-gradient(to right, #ff5757, #ff1a1a)';
      if (props.progress >= 50) return 'linear-gradient(to right, #ffd700, #ffaa00)';
      if (props.progress >= 20) return 'linear-gradient(to right, #c0c0c0, #a6a6a6)';
      return 'linear-gradient(to right, #cd7f32, #b36a00)';
    }};
    transition: width 0.5s ease-in-out;
  }
`;

// Trophy path with improved visuals
const TrophyPathContainer = styled.div`
  position: relative;
  width: 100%;
  height: 30px;
  margin-top: 2px;
  margin-bottom: 10px;
  
  @media (min-width: 768px) {
    height: 40px;
    margin-top: 5px;
    margin-bottom: 15px;
  }
`;

const TrophyPath = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #cd7f32, #c0c0c0, #ffd700, #ff1a1a);
  transform: translateY(-50%);
  border-radius: 5px;
  
  @media (min-width: 768px) {
    height: 6px;
  }
`;

const TrophyMilestone = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    
    @media (min-width: 768px) {
      width: 12px;
      height: 12px;
    }
  }
`;

const TrophyIcon = styled.div`
  font-size: 1rem;
  margin-bottom: 20px;
  opacity: ${props => props.active ? 1 : 0.5};
  filter: ${props => props.active ? 'drop-shadow(0 0 3px rgba(255,255,255,0.8))' : 'grayscale(70%)'};
  transition: all 0.3s ease;
  animation: ${props => props.active ? floatAnimation : 'none'} 2s ease-in-out infinite;
  
  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
`;

const TrophyLabel = styled.div`
  font-size: 0.55rem;
  color: ${props => props.active ? '#db7093' : '#666'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  position: absolute;
  bottom: -14px;
  white-space: nowrap;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 4px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    font-size: 0.7rem;
    bottom: -18px;
    padding: 3px 6px;
  }
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 600;
  color: #db7093;
  margin-bottom: 2px;
  
  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 5px;
  }
`;

const ScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 3px;
  margin-bottom: 3px;
  
  @media (min-width: 768px) {
    gap: 12px;
    margin-bottom: 10px;
    margin-top: 5px;
  }
`;

const StreakDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #db7093;
  
  @media (min-width: 768px) {
    font-size: 0.85rem;
  }
`;

const StreakCount = styled.span`
  font-weight: bold;
  color: ${props => props.count > 0 ? '#ff4500' : '#aaa'};
  margin: 0 3px;
`;

const Trophy = styled.span`
  font-size: 1.3rem;
  color: ${props => {
    if (props.score >= 100) return '#ff1a1a'; // Red trophy
    if (props.score >= 50) return '#ffd700';  // Gold trophy
    if (props.score >= 25) return '#c0c0c0';  // Silver trophy
    if (props.score >= 10) return '#cd7f32';  // Bronze trophy
    return '#808080';  // Default grey
  }};
  filter: ${props => props.score >= 10 ? 'drop-shadow(0 0 3px rgba(0,0,0,0.3))' : 'none'};
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
  }
`;

const ScoreText = styled.span`
  font-weight: 700;
  font-size: 1.1rem;
  color: #db7093;
  
  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
`;

const FeedbackMessage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => 
    props.type === 'success' ? 'rgba(46, 213, 115, 0.92)' : 
    props.type === 'error' ? 'rgba(255, 107, 129, 0.92)' : 
    'rgba(30, 144, 255, 0.92)'};
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 15px;
  padding: 10px;
  text-align: center;
  z-index: 5;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: opacity 0.3s, visibility 0.3s;
  box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.3);
  
  @media (min-width: 768px) {
    font-size: 1.4rem;
    padding: 20px;
  }
`;

const Confetti = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: ${props => props.color};
  top: -20px;
  animation: ${confettiFall} 3s linear forwards;
  z-index: 0;
  opacity: 0.8;
  
  @media (min-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

// New components for the requested features - Mobile optimized
const HintButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: linear-gradient(to right, #ff69b4, #db7093);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  
  @media (min-width: 768px) {
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const HintModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: opacity 0.3s, visibility 0.3s;
`;

const HintContent = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 15px;
  max-width: 95%;
  width: 340px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  text-align: center;
  
  @media (min-width: 768px) {
    padding: 30px;
    width: 500px;
    max-height: 90vh;
  }
`;

const HintTitle = styled.h2`
  color: #db7093;
  margin-bottom: 10px;
  font-size: 1.3rem;
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #db7093;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    top: 10px;
    right: 10px;
  }
`;

const VisualizationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  flex-wrap: wrap;
  padding: 8px;
  background-color: #fff0f5;
  border-radius: 15px;
  border: 2px dashed #ffb6c1;
  
  @media (min-width: 768px) {
    margin: 20px 0;
    padding: 15px;
  }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.cols}, 20px);
  grid-template-rows: repeat(${props => props.rows}, 20px);
  gap: 2px;
  margin: 5px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(${props => props.cols}, 30px);
    grid-template-rows: repeat(${props => props.rows}, 30px);
    gap: 5px;
    margin: 10px;
  }
`;

const GridItem = styled.div`
  width: 20px;
  height: 20px;
  background-color: #ff69b4;
  border-radius: 50%;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
  animation-delay: ${props => props.delay * 0.1}s;
  
  @media (min-width: 768px) {
    width: 30px;
    height: 30px;
  }
  
  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const DivisionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const DivisionRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 8px;
  
  @media (min-width: 768px) {
    margin-bottom: 15px;
  }
`;

const DivisionGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;
  
  @media (min-width: 768px) {
    margin: 0 10px;
  }
`;

const GroupLabel = styled.div`
  font-weight: bold;
  color: #db7093;
  margin-top: 2px;
  font-size: 0.7rem;
  
  @media (min-width: 768px) {
    margin-top: 5px;
    font-size: 0.9rem;
  }
`;

const DivisionCircle = styled.div`
  width: 18px;
  height: 18px;
  background-color: #ff69b4;
  border-radius: 50%;
  margin: 2px;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
  animation-delay: ${props => props.delay * 0.1}s;
  
  @media (min-width: 768px) {
    width: 25px;
    height: 25px;
    margin: 3px;
  }
`;

const ShareButton = styled.button`
  background: linear-gradient(to right, #4361ee, #3a56d4);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  
  @media (min-width: 768px) {
    padding: 12px 20px;
    font-size: 1rem;
    gap: 8px;
    margin-top: 10px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const HistoryButton = styled.button`
  background: linear-gradient(to right, #20bf6b, #01baef);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  width: 60%;
  margin: 6px auto;
  
  @media (min-width: 768px) {
    padding: 10px 16px;
    font-size: 0.9rem;
    gap: 6px;
    margin-top: 8px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const ShareModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: opacity 0.3s, visibility 0.3s;
`;

const ShareContent = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 15px;
  max-width: 95%;
  width: 320px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  text-align: center;
  
  @media (min-width: 768px) {
    padding: 30px;
    width: 500px;
    max-height: 90vh;
  }
`;

const ShareImage = styled.img`
  max-width: 100%;
  border-radius: 10px;
  margin: 10px 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    margin: 15px 0;
  }
`;

const ShareOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
  
  @media (min-width: 768px) {
    gap: 15px;
    margin-top: 20px;
  }
`;

const ShareOption = styled.button`
  background-color: ${props => props.color};
  color: white;
  border: none;
  border-radius: 50px;
  padding: 8px 15px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  
  @media (min-width: 768px) {
    padding: 10px 20px;
    font-size: 1rem;
    gap: 8px;
  }
  
  &:hover {
    opacity: 0.9;
  }
`;

// Milestone animation components - Mobile optimized
const MilestoneAnimation = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => {
    if (props.type === 'bronze') return 'rgba(205, 127, 50, 0.9)';
    if (props.type === 'silver') return 'rgba(192, 192, 192, 0.9)';
    if (props.type === 'gold') return 'rgba(255, 215, 0, 0.9)';
    if (props.type === 'ruby') return 'rgba(255, 0, 0, 0.9)';
    return 'rgba(255, 182, 193, 0.9)';
  }};
  z-index: 1000;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: opacity 0.5s, visibility 0.5s;
  padding: 15px;
`;

const MilestoneTrophy = styled.div`
  font-size: 5rem;
  animation: ${bounce} 2s ease infinite;
  margin-bottom: 15px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  
  @media (min-width: 768px) {
    font-size: 8rem;
    margin-bottom: 20px;
  }
`;

const MilestoneText = styled.div`
  font-size: 1.8rem;
  color: white;
  text-align: center;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 30px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, transparent, white, transparent);
    animation: ${shine} 2s infinite linear;
    background-size: 200px 100%;
  }
`;

// Custom numeric keypad for mobile
const CustomKeypad = styled.div`
  display: ${props => props.show ? 'grid' : 'none'};
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 6px;
  width: 100%;
  margin-top: 0;
  margin-bottom: 5px;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const KeypadButton = styled.button`
  background-color: ${props => props.isAction ? '#f8f9fa' : '#fff0f5'};
  color: #db7093;
  border: 2px solid #ffb6c1;
  border-radius: 10px;
  padding: 0;
  font-size: 1.3rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s;
  height: 42px;
  
  &:active {
    transform: scale(0.95);
    background-color: #ffb6c1;
  }
`;

// New components for improved child-friendliness
const HintImageContainer = styled.div`
  border: 2px solid #ffb6c1;
  border-radius: 15px;
  padding: 10px;
  margin: 10px 0;
  background-color: white;
`;

const FriendlyHelper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 8px;
  text-align: left;
  
  @media (min-width: 768px) {
    gap: 12px;
  }
`;

const HelperEmoji = styled.div`
  font-size: 1.8rem;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HelperText = styled.div`
  font-size: 0.85rem;
  color: #333;
  line-height: 1.3;
  
  @media (min-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

// Add history modal components
const HistoryModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: opacity 0.3s, visibility 0.3s;
`;

const HistoryContent = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 15px;
  max-width: 95%;
  width: 340px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  text-align: center;
  
  @media (min-width: 768px) {
    padding: 30px;
    width: 500px;
    max-height: 90vh;
  }
`;

const HistoryChart = styled.div`
  margin: 20px 0;
  border: 2px solid #ffb6c1;
  border-radius: 15px;
  padding: 10px;
  background-color: #fff0f5;
`;

const HistoryBarContainer = styled.div`
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 0 10px;
  margin-top: 10px;
`;

const HistoryBar = styled.div`
  width: 8px;
  height: ${props => props.height}%;
  background: linear-gradient(to top, #ff69b4, #db7093);
  border-radius: 5px;
  position: relative;
  min-height: 1px;
  
  @media (min-width: 768px) {
    width: 12px;
  }
  
  &::after {
    content: '${props => props.score}';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.6rem;
    color: #db7093;
    
    @media (min-width: 768px) {
      font-size: 0.8rem;
    }
  }
`;

const HistoryLegend = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  margin-top: 25px;
  font-size: 0.6rem;
  color: #db7093;
  
  @media (min-width: 768px) {
    font-size: 0.8rem;
  }
`;

const HistoryHeader = styled.div`
  font-weight: bold;
  color: #db7093;
  margin-bottom: 10px;
  font-size: 0.9rem;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState({ show: false, type: '', message: '', icon: '' });
  const [showConfetti, setShowConfetti] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintData, setHintData] = useState({ num1: 0, num2: 0, operation: '', answer: 0 });
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareImage, setShareImage] = useState('');
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneType, setMilestoneType] = useState('');
  const [useCustomKeypad, setUseCustomKeypad] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isSpecialQuestion, setIsSpecialQuestion] = useState(false);
  const [lastQuestionWasWrong, setLastQuestionWasWrong] = useState(false);
  
  // New state for history feature
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [lastVisitTimestamp, setLastVisitTimestamp] = useState(0);
  
  const inputRef = useRef(null);
  const cardRef = useRef(null);

  // Detect viewport height changes for mobile browsers (handling virtual keyboard)
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      
      // Set custom keypad for mobile if needed
      setUseCustomKeypad(isMobileDevice && window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Create confetti effect
  const createConfetti = () => {
    const colors = ['#ff69b4', '#ffb6c1', '#ffd1dc', '#87cefa', '#ffd700', '#7bed9f'];
    const newConfetti = [];

    const confettiCount = isMobile ? 30 : 50; // Fewer confetti on mobile for performance
    
    for (let i = 0; i < confettiCount; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100, // position in % across the screen
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 7 + 5, // size between 5-12px
        delay: Math.random() * 1.5 // delay up to 1.5s
      });
    }

    setConfetti(newConfetti);
    setShowConfetti(true);
    
    // Clean up confetti after animation
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  // Set document title
  useEffect(() => {
    document.title = "Mathe Prinzessin | Lerne spielerisch Mathe";
  }, []);

  // Load player data and history from localStorage
  useEffect(() => {
    // Clean up old scores and load today's score
    loadScoresAndHistory();
    
    // Check for saved question
    const savedQuestion = localStorage.getItem('mathPrincess_currentQuestion');
    const savedWrongState = localStorage.getItem('mathPrincess_lastQuestionWasWrong');
    const savedAnswer = localStorage.getItem('mathPrincess_answer');
    const savedStreak = localStorage.getItem('mathPrincess_currentStreak');
    const savedSpecial = localStorage.getItem('mathPrincess_isSpecialQuestion');
    
    // Set last visit timestamp
    const now = Date.now();
    const lastVisit = parseInt(localStorage.getItem('mathPrincess_lastVisit') || '0');
    setLastVisitTimestamp(lastVisit);
    localStorage.setItem('mathPrincess_lastVisit', now.toString());
    
    if (savedQuestion) {
      // Restore previous state
      setQuestion(savedQuestion);
      setLastQuestionWasWrong(savedWrongState === 'true');
      setIsSpecialQuestion(savedSpecial === 'true');
      
      if (savedStreak) {
        setCurrentStreak(parseInt(savedStreak) || 0);
      }
      
      // Parse the question to extract the numbers and operation
      const formattedQuestion = savedQuestion.replace('×', '*').replace('÷', '/');
      const [num1, operation, num2] = formattedQuestion.split(' ');
      
      setHintData({
        num1: parseInt(num1),
        num2: parseInt(num2),
        operation: operation === '*' ? '*' : '/',
        answer: parseFloat(savedAnswer) || 0
      });
    } else {
      // No saved question, generate a new one
      generateQuestion();
    }
    
    // Add meta tags for mobile web app optimization
    addMobileWebAppMetaTags();
    
    return () => {
      removeMobileWebAppMetaTags();
    };
  }, []);

  // Add meta tags for mobile web app optimization
  const addMobileWebAppMetaTags = () => {
    // Add viewport meta tag for mobile optimization
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(viewportMeta);
    
    // Add Google Fonts for better typography
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap';
    document.head.appendChild(fontLink);
    
    // Add apple touch icon for home screen
    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.href = '/apple-touch-icon.png';
    document.head.appendChild(appleIcon);
    
    // Make it feel like a native app when added to home screen
    const webAppCapable = document.createElement('meta');
    webAppCapable.name = 'apple-mobile-web-app-capable';
    webAppCapable.content = 'yes';
    document.head.appendChild(webAppCapable);
    
    // Status bar style for iOS
    const statusBar = document.createElement('meta');
    statusBar.name = 'apple-mobile-web-app-status-bar-style';
    statusBar.content = 'black-translucent';
    document.head.appendChild(statusBar);
    
    // Add version number to force cache refresh
    const versionMeta = document.createElement('meta');
    versionMeta.name = 'version';
    versionMeta.content = '1.1.0'; // Increment this when making updates
    document.head.appendChild(versionMeta);
  };

  // Remove meta tags to clean up
  const removeMobileWebAppMetaTags = () => {
    // Clean up meta tags when component unmounts
    const metaTags = document.head.querySelectorAll('meta[name="viewport"], meta[name="apple-mobile-web-app-capable"], meta[name="apple-mobile-web-app-status-bar-style"], meta[name="version"]');
    metaTags.forEach(tag => document.head.removeChild(tag));
    
    const links = document.head.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"], link[rel="apple-touch-icon"]');
    links.forEach(link => document.head.removeChild(link));
  };

  // Auto-hide milestone celebration
  useEffect(() => {
    if (showMilestone) {
      const timer = setTimeout(() => {
        setShowMilestone(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [showMilestone]);

  // Load scores and history from localStorage
  const loadScoresAndHistory = () => {
    try {
      // Get current date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Get saved scores from localStorage
      const savedScores = JSON.parse(localStorage.getItem('mathTrainerScores')) || {};
      
      // If today's entry doesn't exist, create it
      if (!savedScores[today]) {
        savedScores[today] = { score: 0, totalQuestions: 0 };
      }
      
      // Keep only last 30 days data
      const keepScores = {};
      const now = new Date();
      
      // Process and filter data for the last 30 days
      const historyArray = [];
      
      Object.entries(savedScores).forEach(([date, data]) => {
        const entryDate = new Date(date);
        const daysDiff = Math.floor((now - entryDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 30) {
          keepScores[date] = data;
          historyArray.push({
            date,
            score: data.score,
            totalQuestions: data.totalQuestions,
            daysDiff
          });
        }
      });
      
      // Sort by date (newest first)
      historyArray.sort((a, b) => (a.daysDiff - b.daysDiff));
      
      // Update history data
      setHistoryData(historyArray);
      
      // Save filtered data back to localStorage
      localStorage.setItem('mathTrainerScores', JSON.stringify(keepScores));
      
      // Set state from today's score
      setScore(savedScores[today].score);
      setTotalQuestions(savedScores[today].totalQuestions);
      
    } catch (error) {
      console.error('Error loading scores:', error);
      // Reset if there's an error
      setScore(0);
      setTotalQuestions(0);
      localStorage.setItem('mathTrainerScores', JSON.stringify({}));
    }
  };

  // Show feedback message
  const showFeedback = (type, message, icon) => {
    setFeedback({ show: true, type, message, icon });
    
    // Auto-hide feedback after 1.5 seconds
    setTimeout(() => {
      setFeedback(prev => ({ ...prev, show: false }));
    }, 1500);
  };

  // Save current score to localStorage
  const saveScore = (newScore, newTotalQuestions) => {
    try {
      // Get current date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      const savedScores = JSON.parse(localStorage.getItem('mathTrainerScores')) || {};
      
      savedScores[today] = { 
        score: newScore, 
        totalQuestions: newTotalQuestions 
      };
      
      localStorage.setItem('mathTrainerScores', JSON.stringify(savedScores));
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const generateQuestion = () => {
    // Decide if this should be a special question
    // 15% chance of special question if the streak is at least 3, otherwise 5% chance
    const specialQuestionChance = currentStreak >= 3 ? 0.15 : 0.05;
    const makeSpecialQuestion = Math.random() < specialQuestionChance;
    setIsSpecialQuestion(makeSpecialQuestion);
    localStorage.setItem('mathPrincess_isSpecialQuestion', makeSpecialQuestion.toString());
    
    const operations = ['*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2;

    if (makeSpecialQuestion) {
      // Special questions have higher ranges (11-20)
      if (operation === '*') {
        num1 = Math.floor(Math.random() * 10) + 11; // 11-20
        num2 = Math.floor(Math.random() * 10) + 1;  // 1-10
      } else {
        // For division, ensure divisible
        num2 = Math.floor(Math.random() * 5) + 2;   // 2-6
        const possibleResults = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        const result = possibleResults[Math.floor(Math.random() * possibleResults.length)];
        num1 = num2 * result;  // Ensures clean division
      }
    } else {
      // Regular questions (1-10)
      if (operation === '*') {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
      } else {
        num2 = Math.floor(Math.random() * 9) + 2;  // 2-10
        const possibleResults = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const result = possibleResults[Math.floor(Math.random() * possibleResults.length)];
        num1 = num2 * result;  // Ensures clean division
      }
    }

    const newQuestion = `${num1} ${operation === '*' ? '×' : '÷'} ${num2}`;
    setQuestion(newQuestion);
    setAnswer('');

    // Store values for hint system
    const correctAnswer = operation === '*' ? num1 * num2 : num1 / num2;
    setHintData({
      num1: num1,
      num2: num2,
      operation: operation,
      answer: correctAnswer
    });
    
    // Save to localStorage to prevent refreshing for easier questions
    localStorage.setItem('mathPrincess_currentQuestion', newQuestion);
    localStorage.setItem('mathPrincess_lastQuestionWasWrong', 'false'); // Reset when generating new question
    localStorage.setItem('mathPrincess_answer', correctAnswer.toString());
    localStorage.setItem('mathPrincess_currentStreak', currentStreak.toString());
    
    // Reset wrong question flag completely when generating a new question
    setLastQuestionWasWrong(false);
    
    // Record timestamp for this question
    localStorage.setItem('mathPrincess_questionTimestamp', Date.now().toString());
    
    // Focus on input field after generating a new question
    if (inputRef.current && !useCustomKeypad) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const handleCustomKeypadInput = (value) => {
    if (value === 'clear') {
      setAnswer('');
    } else if (value === 'backspace') {
      setAnswer(prev => prev.slice(0, -1));
    } else if (value === 'enter') {
      checkAnswer();
    } else {
      // Only add the digit if we don't have too many digits already
      if (answer.length < 4) {
        setAnswer(prev => prev + value);
      }
    }
  };

  const checkAnswer = () => {
    if (!answer) {
      showFeedback('info', 'Bitte gib eine Antwort ein!', '🤔');
      return;
    }

    // Replace the multiplication symbol with *
    const formattedQuestion = question.replace('×', '*').replace('÷', '/');
    const [num1, operation, num2] = formattedQuestion.split(' ');
    const correctAnswer = operation === '*' ? num1 * num2 : num1 / num2;
    
    // Update total questions counter
    const newTotalQuestions = totalQuestions + 1;
    setTotalQuestions(newTotalQuestions);

    if (parseFloat(answer) === correctAnswer) {
      // Handle correct answer
      
      if (!lastQuestionWasWrong) {
        // Give points only if the last question wasn't answered wrong
        const newScore = score + 1;
        setScore(newScore);
        
        // Update streak for correct answers
        const newStreak = currentStreak + 1;
        setCurrentStreak(newStreak);
        localStorage.setItem('mathPrincess_currentStreak', newStreak.toString());
        
        // Check for milestone achievements
        if (newScore === 10) {
          setMilestoneType('bronze');
          setShowMilestone(true);
        } else if (newScore === 25) {
          setMilestoneType('silver');
          setShowMilestone(true);
        } else if (newScore === 50) {
          setMilestoneType('gold');
          setShowMilestone(true);
        } else if (newScore === 100) {
          setMilestoneType('ruby');
          setShowMilestone(true);
        }
        
        // Different messages based on score milestones
        if (newScore === 10) {
          showFeedback('success', 'Bronze Trophäe freigeschaltet!', '🥉');
        } else if (newScore === 25) {
          showFeedback('success', 'Silber Trophäe freigeschaltet!', '🥈');
        } else if (newScore === 50) {
          showFeedback('success', 'Gold Trophäe freigeschaltet!', '🥇');
        } else if (newScore === 100) {
          showFeedback('success', 'Rubin Trophäe freigeschaltet!', '💎');
        } else {
          // Use more child-friendly encouragement messages
          const successMessages = [
            'Super gemacht! 🌟',
            'Toll! Richtig! 🌟',
            'Fantastisch! 🌟',
            'Klasse! Weiter so! 🌟',
            'Das ist richtig! 🌟'
          ];
          const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
          showFeedback('success', randomMessage, '🌟');
        }
        
        // Create confetti for celebration
        createConfetti();
        
        // Save to localStorage
        saveScore(newScore, newTotalQuestions);
      } else {
        // If last question was wrong, acknowledge correct answer but no points
        showFeedback('success', 'Jetzt richtig! 🌟 Weiter so!', '👍');
      }
      
      // Clear input and generate new question
      setAnswer('');
      setTimeout(() => {
        generateQuestion();
      }, 1200);
      
    } else {
      // Handle incorrect answer
      
      // Reset streak on wrong answer
      setCurrentStreak(0);
      localStorage.setItem('mathPrincess_currentStreak', '0');
      
      // Mark that this question was answered incorrectly
      setLastQuestionWasWrong(true);
      
      // Decrease score for wrong answer (if above 0)
      let newScore = score;
      if (score > 0) {
        newScore = score - 1;
        setScore(newScore);
      }
      
      // Use more encouraging messages for wrong answers
      showFeedback('error', `Fast! Die Antwort ist ${correctAnswer}`, '💪');
      
      // Save to localStorage
      saveScore(newScore, newTotalQuestions);
      
      // Just clear the input without generating a new question
      setAnswer('');
      
      // Update localStorage to mark question as wrong
      localStorage.setItem('mathPrincess_lastQuestionWasWrong', 'true');
      
      // Focus on input field
      if (inputRef.current && !useCustomKeypad) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 100);
      }
    }
  };

  // Handle showing hint
  const handleShowHint = () => {
    setShowHint(true);
  };

  // Handle showing history
  const handleShowHistory = () => {
    // Refresh history data before showing
    loadScoresAndHistory();
    setShowHistory(true);
  };

  // Create and share image
  const handleShare = async () => {
    try {
      if (!cardRef.current) return;
      
      // Create a clone of the card with additional sharing info
      const clone = cardRef.current.cloneNode(true);
      clone.style.width = '500px';
      clone.style.maxWidth = '90%';
      
            // Add a share info section
            const shareInfo = document.createElement('div');
            shareInfo.innerHTML = `
              <div style="margin-top: 20px; padding-top: 15px; border-top: 2px dashed #ffb6c1; text-align: center;">
                <h3 style="color: #db7093; margin-bottom: 10px;">Meine Mathe-Leistung!</h3>
                <p style="font-size: 1.2rem; color: #db7093;">
                  Ich habe <strong>${score} Punkte</strong> bei "Mathe Prinzessin" erreicht!
                </p>
                <p style="font-size: 0.9rem; color: #db7093; margin-top: 5px;">
                  ${new Date().toLocaleDateString()}
                </p>
              </div>
            `;
            clone.appendChild(shareInfo);
            document.body.appendChild(clone);
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';
            clone.style.top = '0';
            
            // Take screenshot
            const canvas = await html2canvas(clone, {
              scale: 2,
              logging: false
            });
            
            // Convert to image
            const image = canvas.toDataURL('image/png');
            setShareImage(image);
            
            // Clean up
            document.body.removeChild(clone);
            
            // Show share modal
            setShowShareModal(true);
          } catch (error) {
            console.error('Error creating share image:', error);
            alert('Es gab ein Problem beim Erstellen des Bildes. Bitte versuche es später erneut.');
          }
        };
      
        // Download image
        const downloadImage = () => {
          const link = document.createElement('a');
          link.download = 'mathe-prinzessin-ergebnis.png';
          link.href = shareImage;
          link.click();
        };
      
        // Share image (simulate)
        const shareVia = (platform) => {
          alert(`Teilen über ${platform} (In einer echten App würde hier die native Teilen-Funktionalität aufgerufen werden)`);
          setShowShareModal(false);
        };
      
        // Calculate progress percentage (based on 50 correct answers goal)
        const progressPercentage = (score / 50) * 100;
      
        const renderMultiplicationGrid = (num1, num2) => {
          // For large numbers, simplify the grid representation
          const displayLimit = 10;
          let limited = false;
          
          let displayNum1 = num1;
          let displayNum2 = num2;
          
          if (num1 > displayLimit || num2 > displayLimit) {
            limited = true;
            displayNum1 = Math.min(num1, displayLimit);
            displayNum2 = Math.min(num2, displayLimit);
          }
          
          const items = [];
          for (let i = 0; i < displayNum1 * displayNum2; i++) {
            items.push(<GridItem key={i} delay={i < 30 ? i * 0.1 : 3} />);
          }
          
          return (
            <VisualizationContainer>
              <ItemGrid cols={displayNum2} rows={displayNum1}>
                {items}
              </ItemGrid>
              <div style={{ 
                marginTop: '10px', 
                color: '#db7093', 
                fontWeight: 'bold', 
                fontSize: isMobile ? '0.8rem' : '1rem' 
              }}>
                {num1} × {num2} = {num1 * num2}
                {limited && <div style={{ fontSize: '0.7rem', marginTop: '5px' }}>
                  (Nur ein Teil der Kreise wird angezeigt)
                </div>}
              </div>
            </VisualizationContainer>
          );
        };
      
        const renderDivisionVisualization = (num1, num2) => {
          const quotient = num1 / num2;
          const groups = [];
          
          // Limit visualization for large numbers
          const displayLimit = 10;
          let limited = false;
          
          let displayNum1 = num1;
          let displayNum2 = num2;
          
          if (num1 > 40 || num2 > displayLimit) {
            limited = true;
            displayNum1 = Math.min(num1, 40);
            displayNum2 = Math.min(num2, displayLimit);
          }
          
          const displayQuotient = Math.floor(displayNum1 / displayNum2);
          
          for (let i = 0; i < displayNum2; i++) {
            const groupItems = [];
            for (let j = 0; j < displayQuotient; j++) {
              groupItems.push(<DivisionCircle key={`${i}-${j}`} delay={i * displayQuotient + j < 30 ? i * displayQuotient + j : 3} />);
            }
            groups.push(
              <DivisionGroup key={i}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>{groupItems}</div>
                <GroupLabel>Gruppe {i+1}</GroupLabel>
              </DivisionGroup>
            );
          }
          
          return (
            <VisualizationContainer>
              <DivisionContainer>
                <div style={{ 
                  color: '#db7093', 
                  fontWeight: 'bold', 
                  marginBottom: '8px',
                  fontSize: isMobile ? '0.8rem' : '1rem'
                }}>
                  {num1} ÷ {num2} = {quotient}
                  {limited && <div style={{ fontSize: '0.7rem', marginTop: '5px' }}>
                    (Vereinfachte Darstellung)
                  </div>}
                </div>
                <DivisionRow>
                  {groups}
                </DivisionRow>
              </DivisionContainer>
            </VisualizationContainer>
          );
        };
      
        // Format date for display in history
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
        };
      
        return (
          <AppContainer style={{ height: `${viewportHeight}px` }}>
            {/* Confetti effect when answering correctly */}
            {showConfetti && confetti.map(c => (
              <Confetti 
                key={c.id}
                style={{
                  left: `${c.x}%`,
                  width: `${c.size}px`,
                  height: `${c.size}px`,
                  animationDelay: `${c.delay}s`
                }}
                color={c.color}
              />
            ))}
            
            <Card ref={cardRef}>
              {/* Decorative sparkles */}
              <Sparkle />
              <Sparkle />
              <Sparkle />
              <Sparkle />
              
              <Title>Mathe Prinzessin 👑</Title>
              
              <ProgressContainer>
                <ProgressLabel>
                  <span>Ziel: 50 Punkte</span>
                  <span>{score} / 50</span>
                </ProgressLabel>
                <ProgressBar progress={progressPercentage} />
              </ProgressContainer>
              
              {/* Beautiful Trophy Path */}
              <TrophyPathContainer>
                <TrophyPath />
                <TrophyMilestone style={{ left: '10%' }}>
                  <TrophyIcon active={score >= 10}>🥉</TrophyIcon>
                  <TrophyLabel active={score >= 10}>Bronze</TrophyLabel>
                </TrophyMilestone>
                <TrophyMilestone style={{ left: '40%' }}>
                  <TrophyIcon active={score >= 25}>🥈</TrophyIcon>
                  <TrophyLabel active={score >= 25}>Silber</TrophyLabel>
                </TrophyMilestone>
                <TrophyMilestone style={{ left: '70%' }}>
                  <TrophyIcon active={score >= 50}>🥇</TrophyIcon>
                  <TrophyLabel active={score >= 50}>Gold</TrophyLabel>
                </TrophyMilestone>
                <TrophyMilestone style={{ left: '95%' }}>
                  <TrophyIcon active={score >= 100}>💎</TrophyIcon>
                  <TrophyLabel active={score >= 100}>Rubin</TrophyLabel>
                </TrophyMilestone>
              </TrophyPathContainer>
              
              <QuestionBox>
                {isSpecialQuestion && <SpecialQuestionIndicator>Bonus-Aufgabe</SpecialQuestionIndicator>}
                {question}
                <FeedbackMessage 
                  show={feedback.show} 
                  type={feedback.type}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>{feedback.icon}</span>
                    <span>{feedback.message}</span>
                  </div>
                </FeedbackMessage>
                
                {/* Hint button */}
                <HintButton onClick={handleShowHint}>
                  ?
                </HintButton>
              </QuestionBox>
              
              {/* Streak counter */}
              <StreakDisplay>
                {currentStreak > 0 ? 
                  <>Richtig in Folge: <StreakCount count={currentStreak}>{currentStreak}x</StreakCount> 🔥</> : 
                  <>Neue Runde starten!</>
                }
              </StreakDisplay>
              
              <InputContainer>
                <Input
                  ref={inputRef}
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Deine Antwort"
                  inputMode={useCustomKeypad ? 'none' : 'numeric'} // Prevent mobile keyboard if using custom keypad
                  showEnterButton={isMobile && !useCustomKeypad}
                  readOnly={useCustomKeypad} // Make read-only if using custom keypad
                  onClick={() => {
                    if (useCustomKeypad) {
                      // Prevent keyboard on mobile when clicking input
                      inputRef.current?.blur();
                    }
                  }}
                />
                {(isMobile && !useCustomKeypad) && (
                  <EnterButton onClick={checkAnswer}>
                    <EnterIcon>↵</EnterIcon>
                  </EnterButton>
                )}
              </InputContainer>
              
              {/* Custom numeric keypad for mobile */}
              {useCustomKeypad && (
                <CustomKeypad show={useCustomKeypad}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <KeypadButton key={num} onClick={() => handleCustomKeypadInput(num.toString())}>
                      {num}
                    </KeypadButton>
                  ))}
                  <KeypadButton isAction onClick={() => handleCustomKeypadInput('clear')}>C</KeypadButton>
                  <KeypadButton onClick={() => handleCustomKeypadInput('0')}>0</KeypadButton>
                  <KeypadButton isAction onClick={() => handleCustomKeypadInput('backspace')}>⌫</KeypadButton>
                </CustomKeypad>
              )}
              
              {/* Action buttons in a row on mobile */}
              <ButtonContainer>
                <Button 
                  primary 
                  onClick={checkAnswer}
                >
                  {useCustomKeypad ? 'OK ✨' : 'Prüfen ✨'}
                </Button>
                <Button 
                  onClick={generateQuestion}
                >
                  {useCustomKeypad ? 'Neu 🦄' : 'Neue Aufgabe 🦄'}
                </Button>
              </ButtonContainer>
              
              {/* New feature: Show history button */}
              <HistoryButton onClick={handleShowHistory}>
                📊 Meine Fortschritte
              </HistoryButton>
              
              <ShareButton onClick={handleShare}>
                <span>Teilen</span>
                <span>📱</span>
              </ShareButton>
              
              <Footer>
                <ScoreDisplay>
                  <Trophy score={score}>🏆</Trophy>
                  <ScoreText>{score} Punkte</ScoreText>
                </ScoreDisplay>
                
                <span>mit <HeartIcon>♥</HeartIcon> für Emily 👸🏼 von Papa</span>
              </Footer>
            </Card>
            
            {/* Hint Modal */}
            <HintModal show={showHint} onClick={() => setShowHint(false)}>
              <HintContent onClick={e => e.stopPropagation()}>
                <HintTitle>Tipp</HintTitle>
                <CloseButton onClick={() => setShowHint(false)}>×</CloseButton>
                
                {hintData.operation === '*' ? (
                  <>
                    <FriendlyHelper>
                      <HelperEmoji>🦄</HelperEmoji>
                      <HelperText>
                        Bei <strong>{hintData.num1} mal {hintData.num2}</strong> legst du {hintData.num1} Reihen mit jeweils {hintData.num2} Kreisen.
                      </HelperText>
                    </FriendlyHelper>
                    <HintImageContainer>
                      {renderMultiplicationGrid(hintData.num1, hintData.num2)}
                    </HintImageContainer>
                    <HelperText>
                      Zähle alle Kreise: Es sind {hintData.num1 * hintData.num2}!
                    </HelperText>
                  </>
                ) : (
                  <>
                    <FriendlyHelper>
                      <HelperEmoji>🦄</HelperEmoji>
                      <HelperText>
                        Bei <strong>{hintData.num1} geteilt durch {hintData.num2}</strong> teilst du {hintData.num1} Kreise in {hintData.num2} gleiche Gruppen.
                      </HelperText>
                    </FriendlyHelper>
                    <HintImageContainer>
                      {renderDivisionVisualization(hintData.num1, hintData.num2)}
                    </HintImageContainer>
                    <HelperText>
                      Jede Gruppe hat {hintData.answer} Kreise!
                    </HelperText>
                  </>
                )}
                
                <Button primary onClick={() => setShowHint(false)} style={{ marginTop: '15px' }}>
                  Ich hab's verstanden!
                </Button>
              </HintContent>
            </HintModal>
            
            {/* History Modal - New feature */}
            <HistoryModal show={showHistory} onClick={() => setShowHistory(false)}>
              <HistoryContent onClick={e => e.stopPropagation()}>
                <HintTitle>Meine Fortschritte</HintTitle>
                <CloseButton onClick={() => setShowHistory(false)}>×</CloseButton>
                
                <HistoryChart>
                  <HistoryHeader>Punkte der letzten 30 Tage</HistoryHeader>
                  <HistoryBarContainer>
                    {historyData.map((day, index) => {
                      // Calculate height percentage (max value 100 for scaling)
                      const maxScore = Math.max(...historyData.map(d => d.score), 10); // At least 10 to avoid division by zero
                      const heightPercentage = (day.score / maxScore) * 80; // 80% max height for bars
                      
                      return (
                        <HistoryBar 
                          key={index} 
                          height={heightPercentage > 0 ? Math.max(heightPercentage, 5) : 0} 
                          score={day.score}
                        />
                      );
                    })}
                  </HistoryBarContainer>
                  <HistoryLegend>
                    {historyData.length > 0 ? (
                      historyData.map((day, index) => (
                        <span key={index}>{formatDate(day.date)}</span>
                      ))
                    ) : (
                      <span style={{ textAlign: 'center', width: '100%' }}>Noch keine Daten vorhanden</span>
                    )}
                  </HistoryLegend>
                </HistoryChart>
                
                <Button primary onClick={() => setShowHistory(false)} style={{ marginTop: '15px' }}>
                  Zurück zum Spiel
                </Button>
              </HistoryContent>
            </HistoryModal>
            
            {/* Share Modal */}
            <ShareModal show={showShareModal} onClick={() => setShowShareModal(false)}>
              <ShareContent onClick={e => e.stopPropagation()}>
                <HintTitle>Teile deinen Erfolg!</HintTitle>
                <CloseButton onClick={() => setShowShareModal(false)}>×</CloseButton>
                
                {shareImage && <ShareImage src={shareImage} alt="Math Princess Results" />}
                
                <ShareOptions>
                  <ShareOption color="#25D366" onClick={() => shareVia('WhatsApp')}>
                    <span>WhatsApp</span>
                  </ShareOption>
                  <ShareOption color="#3b5998" onClick={() => shareVia('Messenger')}>
                    <span>Messenger</span>
                  </ShareOption>
                  <ShareOption color="#000000" onClick={downloadImage}>
                    <span>Speichern</span>
                  </ShareOption>
                </ShareOptions>
              </ShareContent>
            </ShareModal>
            
            {/* Milestone Animation */}
            <MilestoneAnimation show={showMilestone} type={milestoneType}>
              <MilestoneTrophy>🏆</MilestoneTrophy>
              <MilestoneText>
                {milestoneType === 'bronze' && 'Bronze Trophäe!'}
                {milestoneType === 'silver' && 'Silber Trophäe!'}
                {milestoneType === 'gold' && 'Gold Trophäe!'}
                {milestoneType === 'ruby' && 'Rubin Trophäe!'}
              </MilestoneText>
              <Button 
                onClick={() => setShowMilestone(false)}
                style={{ 
                  background: 'white', 
                  color: '#db7093',
                  padding: isMobile ? '10px 20px' : '15px 30px',
                  fontSize: isMobile ? '1rem' : '1.2rem'
                }}
              >
                Weiter spielen
              </Button>
            </MilestoneAnimation>
          </AppContainer>
        );
      }
      
      export default App;