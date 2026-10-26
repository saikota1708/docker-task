package com.klef.soa.exam.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="furniture_rental")
public class FurnitureRental 
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@Column(nullable = false)
	private String furnituretype;
	@Column(nullable = false)
	private String rentalPeriod;
	@Column(nullable = false)
	private double monthlyrent;
	@Column(nullable = false)
	private boolean available;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getFurnituretype() {
		return furnituretype;
	}
	public void setFurnituretype(String furnituretype) {
		this.furnituretype = furnituretype;
	}
	public String getRentalPeriod() {
		return rentalPeriod;
	}
	public void setRentalPeriod(String rentalPeriod) {
		this.rentalPeriod = rentalPeriod;
	}
	public double getMonthlyrent() {
		return monthlyrent;
	}
	public void setMonthlyrent(double monthlyrent) {
		this.monthlyrent = monthlyrent;
	}
	public boolean isAvailable() {
		return available;
	}
	public void setAvailable(boolean available) {
		this.available = available;
	}
}
