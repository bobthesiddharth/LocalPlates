package com.localplates.LocalPlates.repository;

import com.localplates.LocalPlates.model.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {
    Optional<OtpCode> findTopByEmailAndCodeAndPurposeAndUsedOrderByExpiresAtDesc(
            String email, String code, String purpose, boolean used
    );
}
