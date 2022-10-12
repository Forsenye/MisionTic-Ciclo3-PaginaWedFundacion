-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Origen`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Origen` (
  `idOrigen` INT NOT NULL,
  `persona_natural` VARCHAR(45) NOT NULL,
  `persona_juridica` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idOrigen`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Donante`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Donante` (
  `idDonante` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellidos` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `telefono` INT NOT NULL,
  `tipo_documento` VARCHAR(45) NOT NULL,
  `num_documento` INT NOT NULL,
  `Origen_idOrigen` INT NOT NULL,
  PRIMARY KEY (`idDonante`, `Origen_idOrigen`),
  INDEX `fk_Donante_Origen1_idx` (`Origen_idOrigen` ASC) VISIBLE,
  CONSTRAINT `fk_Donante_Origen1`
    FOREIGN KEY (`Origen_idOrigen`)
    REFERENCES `mydb`.`Origen` (`idOrigen`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Tipo_donacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Tipo_donacion` (
  `idTipo_donacion` INT NOT NULL AUTO_INCREMENT,
  `dinero` DOUBLE NOT NULL,
  `especie` VARCHAR(45) NOT NULL,
  `Donante_idDonante` INT NOT NULL,
  PRIMARY KEY (`idTipo_donacion`, `Donante_idDonante`),
  INDEX `fk_Tipo_donacion_Donante_idx` (`Donante_idDonante` ASC) VISIBLE,
  CONSTRAINT `fk_Tipo_donacion_Donante`
    FOREIGN KEY (`Donante_idDonante`)
    REFERENCES `mydb`.`Donante` (`idDonante`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
