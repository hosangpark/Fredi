import React, { useEffect, useRef, useState } from 'react';

export const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
export const idReg = /^[A-Za-z0-9]+$/;
export const phoneReg = /^(\d{0,3})(\d{0,4})(\d{0,4})$/;
export const businessReg = /^(\d{3})(\d{2})(\d{5})$/;
export const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
export const NoEmptySpace = (data:any) => {
  let returndata = data.replace(/^\s+|\s+$/gm,'')
  return returndata
}
export const NoDoubleEmptySpace = (data:any) => {
  let returndata = data.replace(/\s{2,}/gi, ' ')
  return returndata
}