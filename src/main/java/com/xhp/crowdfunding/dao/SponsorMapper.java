package com.xhp.crowdfunding.dao;

import com.xhp.crowdfunding.entity.Sponsor;

public interface SponsorMapper {
    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sponsor
     *
     * @mbg.generated
     */
    int deleteByPrimaryKey(String sid);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sponsor
     *
     * @mbg.generated
     */
    int insert(Sponsor record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sponsor
     *
     * @mbg.generated
     */
    int insertSelective(Sponsor record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sponsor
     *
     * @mbg.generated
     */
    Sponsor selectByPrimaryKey(String sid);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sponsor
     *
     * @mbg.generated
     */
    int updateByPrimaryKeySelective(Sponsor record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sponsor
     *
     * @mbg.generated
     */
    int updateByPrimaryKey(Sponsor record);
}